{/*Monitoriza el pitch de la canción y muestra si está cerca o lejos de la nota esperada*/}

import { useEffect, useState } from "react";

type Note = { note: number; freq_hz: number; start: number; end: number; duration: number };

interface PitchMonitorProps {
  pitch: number;
  currentTime: number;
  notes: Note[];
  playing: boolean;
}

export default function PitchMonitor({
  pitch,
  currentTime,
  notes,
  playing,
}: PitchMonitorProps) {
  const [expectedPitch, setExpectedPitch] = useState(0);
  const [diff, setDiff] = useState(0);
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    if (!playing || pitch === 0) {
      setExpectedPitch(0);
      setDiff(0);
      setIsClose(false);
      return;
    }

    const note = notes.find(
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
  }, [currentTime, pitch, playing, notes]);

  return (
    <div className="mb-4">
      <div
        className={`px-4 py-2 rounded-md text-center font-bold min-w-[200px] inline-block ${
          !playing || expectedPitch === 0
            ? "bg-gray-600 text-white"
            : isClose
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {!playing || expectedPitch === 0
          ? "Esperando..."
          : isClose
          ? `Cerca ✔️ (Diferencia: ${diff.toFixed(1)} Hz)`
          : `Lejos ✖️ (Diferencia: ${diff.toFixed(1)} Hz)`}
      </div>
    </div>
  );
}
