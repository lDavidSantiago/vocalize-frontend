
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePitchDetector } from "../hooks/usePitchTest";
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

const albumMap: Record<string, { audioFile: string; jsonFile: any; lyrics?: LyricsData }> = {
  "1": { audioFile: audioFile, jsonFile: notesJson1, lyrics: lyrics1 as LyricsData },
  "2": { audioFile: audioFile2, jsonFile: notesJson2, lyrics: lyrics2 as LyricsData },
  "3": { audioFile: audioFile3, jsonFile: notesJson3, lyrics: lyrics3 as LyricsData },
  "4": { audioFile: audioFile4, jsonFile: notesJson4, lyrics: lyrics4 as LyricsData },
  "5": { audioFile: audioFile5, jsonFile: notesJson5, lyrics: lyrics5 as LyricsData },
  "6": { audioFile: audioFile, jsonFile: notesJson2, lyrics: lyrics2 as LyricsData },
  "7": { audioFile: audioFile, jsonFile: notesJson1, lyrics: lyrics1 as LyricsData },
  "8": { audioFile: audioFile, jsonFile: notesJson2, lyrics: lyrics2 as LyricsData },
};

export default function KaraokePage() {
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get("albumId") || "1";
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [expectedPitch, setExpectedPitch] = useState(0);
  const { pitch, clarity } = usePitchDetector(playing);

  const selectedAlbum = albumMap[albumId] || albumMap["1"];
  const notes = selectedAlbum.jsonFile.notes as Array<{ note: number; freq_hz: number; start: number; end: number; duration: number }>;

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

  return (
    <div className="w-full min-h-screen bg-[#0f0f15] text-white font-sans flex items-center justify-center">
      <div className="w-full max-w-[1100px] p-5">
        <SongPlayer
          src={selectedAlbum.audioFile}
          onTimeChange={setTime}
          onPlayingChange={setPlaying}
        />
        <div className="mb-2 text-gray-200 text-sm text-right">
          Pitch: {pitch.toFixed(1)} Hz · Expected Pitch:{" "}
          {expectedPitch.toFixed(1)} Hz · Claridad: {(clarity * 100).toFixed(0)}%
        </div>
        <PitchMonitor
          pitch={pitch}
          currentTime={time}
          notes={notes}
          playing={playing}
        />
        <MidiVisualizer notes={notes} currentTime={time} pitchHz={pitch} clarity={clarity} width={1060} height={340} />
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