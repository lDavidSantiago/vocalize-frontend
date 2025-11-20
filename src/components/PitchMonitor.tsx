import React, { useRef, useState, useEffect } from "react";
import referenceNotes from "../data/midiganzoesgei.mid_extracted.json";
import { usePitchDetector } from "../hooks/usePitchTest";

function KaraokePitchComparer({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [listening, setListening] = useState(false);
  const { pitch, clarity } = usePitchDetector(listening);

  const [currentTime, setCurrentTime] = useState(0);
  const [expectedPitch, setExpectedPitch] = useState(0);
  const [diff, setDiff] = useState(0);
  const [isClose, setIsClose] = useState(false);

  const start = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setListening(true);
  };

  const stop = () => {
    setListening(false);
    if (audioRef.current) audioRef.current.pause();

    setCurrentTime(0);
    setExpectedPitch(0);
    setDiff(0);
    setIsClose(false);
  };

  // Update time from audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Compare pitch with expected note
  useEffect(() => {
    if (!listening || pitch === 0) {
      setExpectedPitch(0);
      setDiff(0);
      setIsClose(false);
      return;
    }

    const note = referenceNotes.notes.find(
      (n) => currentTime >= n.start && currentTime < n.start + n.duration
    );

    if (note) {
      const difference = Math.abs(pitch - note.freq_hz);
      setExpectedPitch(note.freq_hz);
      setDiff(difference);
      setIsClose(difference < 30);
    } else {
      setExpectedPitch(0);
      setDiff(0);
      setIsClose(false);
    }
  }, [currentTime, pitch, listening]);

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <audio ref={audioRef} src={audioUrl} />

      <button onClick={start}>▶️ Empezar</button>
      <button onClick={stop}>⏹️ Detener</button>

      <hr />

      <div>
        <b>Tiempo:</b> {currentTime.toFixed(2)}s
      </div>
      <div>
        <b>Pitch actual:</b> {pitch.toFixed(1)} Hz
      </div>
      <div>
        <b>Pitch esperado:</b> {expectedPitch.toFixed(1)} Hz
      </div>
      <div>
        <b>Diferencia:</b> {diff.toFixed(1)} Hz
      </div>
      <div>
        <b>Claridad:</b> {(clarity * 100).toFixed(0)}%
      </div>

      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          background: isClose ? "#54d161" : "#d15454",
          color: "white",
          borderRadius: "8px",
          width: "120px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {isClose ? "Cerca ✔️" : "Lejos ✖️"}
      </div>
    </div>
  );
}

export default KaraokePitchComparer;
