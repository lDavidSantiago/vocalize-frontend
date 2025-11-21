{/*Visualiza las notas MIDI en un canvas amigable para karaoke*/}

import { useEffect, useMemo, useRef } from "react";

type Note = { note: number; freq_hz: number; start: number; end: number; duration: number };

{/* Converts frequency to MIDI note number (A4 = 69 Hz) */}
function freqToMidi(f: number) {
  return 69 + 12 * Math.log2(f / 440);
}

export default function MidiVisualizer({
  notes,
  currentTime,
  pitchHz,
  clarity,
  width = 900,
  height = 300,
  className = "",
}: {
  notes: Note[];
  currentTime: number;
  pitchHz: number;
  clarity: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const range = useMemo(() => {
    const min = Math.min(...notes.map((n) => n.note));
    const max = Math.max(...notes.map((n) => n.note));
    return { min: min - 2, max: max + 2 };
  }, [notes]);

  const pps = 140;
  const playheadX = width * 0.25;
  const minNote = range.min;
  const maxNote = range.max;
  const lanes = maxNote - minNote + 1;
  const laneH = height / lanes;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i <= lanes; i++) {
      const y = height - i * laneH;
      ctx.strokeStyle = i % 12 === 0 ? "#262634" : "#1b1b28";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const startWin = currentTime - playheadX / pps;
    const endWin = currentTime + (width - playheadX) / pps;

    const visible = notes.filter((n) => n.end >= startWin && n.start <= endWin);
    for (const n of visible) {
      const x1 = playheadX + (n.start - currentTime) * pps;
      const x2 = playheadX + (n.end - currentTime) * pps;
      const y = height - (n.note - minNote + 1) * laneH;
      const h = laneH - 2;
      ctx.fillStyle = "#d1d5db";
      ctx.fillRect(x1, y + 1, x2 - x1, h);
    }

    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    if (pitchHz > 0 && clarity > 0.6) {
      const midi = Math.round(freqToMidi(pitchHz));
      const y = height - (midi - minNote + 0.5) * laneH;
      ctx.fillStyle = "#fde68a";
      ctx.beginPath();
      ctx.arc(playheadX, y, Math.max(4, laneH * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }
  }, [notes, currentTime, pitchHz, clarity, width, height, minNote, maxNote, laneH, lanes]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
