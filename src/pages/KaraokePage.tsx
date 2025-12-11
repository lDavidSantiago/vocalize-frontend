import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePitchDetector } from "../hooks/usePitchTest";
import { useSessionNoteRecorder } from "../hooks/useSessionNoteRecorder";
import MidiVisualizer from "../components/MidiVisualizer";
import PitchMonitor from "../components/PitchMonitor";
import SongPlayer from "../components/SongPlayer";
import LyricsDisplay from "../components/LyricsDisplay";
import type { LyricsData } from "../types/lyrics";

import notesJson1 from "../data/miditufaltadequerer.mid_extracted.json";
import notesJson2 from "../data/midiganzoesgei.mid_extracted.json";
import notesJson3 from "../data/midiclairo-pretty-girl.mid_extracted.json";
import notesJson4 from "../data/midirecently.mid_extracted.json";
import notesJson5 from "../data/midistay-with-me-mayonaka-no-door-miki-matsubara.mid_extracted.json";

import audioFile from "../assets/karaoke_moon.mp3";
import audioFile2 from "../assets/el_violador.mp3";
import audioFile3 from "../assets/karaoke_pretty_girl.mp3";
import audioFile4 from "../assets/karaoke_liana.mp3";
import audioFile5 from "../assets/karaoke_stay_with_me.mp3";

import lyrics1 from "../lyrics/tufaltadequerer.json";
import lyrics2 from "../lyrics/ganzoesgei.json";
import lyrics3 from "../lyrics/pretty-girl.json";
import lyrics4 from "../lyrics/recently.json";
import lyrics5 from "../lyrics/stay-with-me.json";

const albumMap: Record<
  string,
  { audioFile: string; jsonFile: any; lyrics?: LyricsData }
> = {
  "1": {
    audioFile: audioFile,
    jsonFile: notesJson1,
    lyrics: lyrics1 as LyricsData,
  },
  "2": {
    audioFile: audioFile2,
    jsonFile: notesJson2,
    lyrics: lyrics2 as LyricsData,
  },
  "3": {
    audioFile: audioFile3,
    jsonFile: notesJson3,
    lyrics: lyrics3 as LyricsData,
  },
  "4": {
    audioFile: audioFile4,
    jsonFile: notesJson4,
    lyrics: lyrics4 as LyricsData,
  },
  "5": {
    audioFile: audioFile5,
    jsonFile: notesJson5,
    lyrics: lyrics5 as LyricsData,
  },
  "6": {
    audioFile: audioFile,
    jsonFile: notesJson2,
    lyrics: lyrics2 as LyricsData,
  },
  "7": {
    audioFile: audioFile,
    jsonFile: notesJson1,
    lyrics: lyrics1 as LyricsData,
  },
  "8": {
    audioFile: audioFile,
    jsonFile: notesJson2,
    lyrics: lyrics2 as LyricsData,
  },
};

export default function KaraokePage() {
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get("albumId") || "1";
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [expectedPitch, setExpectedPitch] = useState(0);
  const { pitch, clarity } = usePitchDetector(playing);
  const {
    startSession,
    stopSession,
    record,
    exportNotes,
    clearNotes,
    notes: sessionNotes,
  } = useSessionNoteRecorder({ minClarity: 0.7, minIntervalMs: 80 });
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    summary?: string;
    motivation?: string;
  } | null>(null);
  const REVIEW_URL =
    import.meta.env.VITE_REVIEW_URL ?? "http://localhost:5174/api/review";

  const selectedAlbum = albumMap[albumId] || albumMap["1"];
  const notes = selectedAlbum.jsonFile.notes as Array<{
    note: number;
    freq_hz: number;
    start: number;
    end: number;
    duration: number;
  }>;

  useEffect(() => {
    if (!playing || pitch === 0) {
      setExpectedPitch(0);
      return;
    }

    const note = notes.find(
      (n) => time >= n.start && time < n.start + n.duration
    );

    if (note) {
      setExpectedPitch(note.freq_hz);
    } else {
      setExpectedPitch(0);
    }
  }, [time, pitch, playing, notes]);

  useEffect(() => {
    if (playing) {
      startSession();
    } else {
      stopSession();
    }
  }, [playing, startSession, stopSession]);

  useEffect(() => {
    if (!playing) return;
    if (!pitch || clarity <= 0) return;
    record(pitch, clarity, time);
  }, [pitch, clarity, time, playing, record]);

  async function handleSongEnd() {
    stopSession();
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const payload = {
        sessionNotes: sessionNotes,
        referenceNotes: notes,
        meta: { albumId, audioFile: selectedAlbum.audioFile },
      };

      const resp = await fetch(REVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error(`Review failed: ${resp.status}`);

      const body = await resp.json();

      setReviewResult({
        score: body.score ?? 0,
        summary: body.summary ?? body.message ?? "",
        motivation: body.motivation ?? body.motivacion ?? "",
      });

      setTimeout(() => setIsReviewing(false), 400);
    } catch (err: any) {
      setReviewResult({ score: 0, summary: err?.message ?? String(err) });
    } finally {
      if (!reviewResult) setIsReviewing(false);
    }
  }

  async function handleTestReview() {
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const testPayload = {
        sessionNotes: [
          { timeSec: 0, pitchHz: 23.5 },
          { timeSec: 0.5, pitchHz: 24.0 },
          { timeSec: 1.0, pitchHz: 24.5 },
          { timeSec: 1.5, pitchHz: 24.0 },
          { timeSec: 2.0, pitchHz: 23.5 },
        ],
        referenceNotes: [
          { start: 0, duration: 0.5, freq_hz: 23.5 },
          { start: 0.5, duration: 0.5, freq_hz: 22.0 },
          { start: 1.0, duration: 0.5, freq_hz: 28.5 },
          { start: 1.5, duration: 0.5, freq_hz: 23.0 },
          { start: 2.0, duration: 0.5, freq_hz: 100.5 },
        ],
        meta: { songName: "test" },
      };

      const resp = await fetch(REVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      });

      if (!resp.ok) throw new Error(`Review failed: ${resp.status}`);

      const body = await resp.json();

      setReviewResult({
        score: body.score ?? 0,
        summary: body.summary ?? body.message ?? "",
        motivation: body.motivation ?? body.motivacion ?? "",
      });

      setTimeout(() => setIsReviewing(false), 400);
    } catch (err: any) {
      setReviewResult({ score: 0, summary: err?.message ?? String(err) });
    } finally {
      if (!reviewResult) setIsReviewing(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f15] text-white font-sans flex items-center justify-center">
      <div className="w-full max-w-[1100px] p-5">
        <SongPlayer
          src={selectedAlbum.audioFile}
          onTimeChange={setTime}
          onPlayingChange={setPlaying}
          onEnded={handleSongEnd}
        />
        <div className="mb-2 text-gray-200 text-sm text-right">
          Pitch: {pitch.toFixed(1)} Hz · Expected Pitch:{" "}
          {expectedPitch.toFixed(1)} Hz · Claridad: {(clarity * 100).toFixed(0)}
          %
        </div>
        <div className="mb-4 text-right">
          <button
            className="mr-2 px-3 py-1 bg-indigo-600 rounded text-sm"
            onClick={() => exportNotes()}
          >
            Exportar notas de sesión ({sessionNotes.length})
          </button>
          <button
            className="mr-2 px-3 py-1 bg-green-600 rounded text-sm"
            onClick={handleTestReview}
          >
            Prueba rápida
          </button>
          <button
            className="px-3 py-1 bg-gray-700 rounded text-sm"
            onClick={() => clearNotes()}
          >
            Limpiar
          </button>
        </div>
        {isReviewing && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
            <div className="bg-[#0f1724] p-6 rounded shadow-lg text-center w-[520px]">
              <div className="mb-3 text-white">
                Analizando tu canto — por favor espera...
              </div>
              <div className="h-8 w-8 border-4 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <div className="text-sm text-gray-300">
                Esto suele tardar menos de 10s.
              </div>
            </div>
          </div>
        )}

        {reviewResult && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#071029] p-8 rounded shadow-xl max-w-[720px] w-full text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Puntuación</h2>
              <div className="text-6xl font-extrabold text-indigo-400 mb-4">
                {Math.round(reviewResult.score)}
              </div>
              {reviewResult.summary && (
                <div className="text-sm text-gray-200 mb-4">
                  {reviewResult.summary}
                </div>
              )}
              {reviewResult.motivation && (
                <div className="text-sm text-indigo-200 italic mb-6">
                  "{reviewResult.motivation}"
                </div>
              )}
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-indigo-600 rounded"
                  onClick={() => {
                    setReviewResult(null);
                  }}
                >
                  Cerrar
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded"
                  onClick={() => {
                    exportNotes();
                    setReviewResult(null);
                  }}
                >
                  Descargar notas
                </button>
              </div>
            </div>
          </div>
        )}
        <PitchMonitor
          pitch={pitch}
          currentTime={time}
          notes={notes}
          playing={playing}
        />
        <MidiVisualizer
          notes={notes}
          currentTime={time}
          pitchHz={pitch}
          clarity={clarity}
          width={1060}
          height={340}
        />
        {selectedAlbum.lyrics && (
          <LyricsDisplay
            lyrics={selectedAlbum.lyrics}
            currentTime={time}
            playing={playing}
          />
        )}
      </div>
    </div>
  );
}
