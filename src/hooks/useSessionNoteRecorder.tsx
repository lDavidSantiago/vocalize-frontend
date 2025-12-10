import { useCallback, useRef, useState } from "react";
import { freqToMidi, freqToNoteName } from "../utils/midi";

export type RecordedNote = {
  pitchHz: number;
  clarity: number;
  midi?: number | null;
  noteName?: string;
  timeSec?: number;
  ts: number; 
};

export function useSessionNoteRecorder({ minClarity = 0.7, minIntervalMs = 100 } = {}) {
  const notesRef = useRef<RecordedNote[]>([]);
  const [notes, setNotes] = useState<RecordedNote[]>([]);
  const runningRef = useRef(false);
  const lastRecordAtRef = useRef(0);

  const startSession = useCallback(() => {
    notesRef.current = [];
    setNotes([]);
    runningRef.current = true;
    lastRecordAtRef.current = 0;
  }, []);

  const stopSession = useCallback(() => {
    runningRef.current = false;
  }, []);

  const clearNotes = useCallback(() => {
    notesRef.current = [];
    setNotes([]);
  }, []);

  const record = useCallback((pitchHz: number, clarity: number, timeSec?: number) => {
    if (!runningRef.current) return;
    if (!pitchHz || clarity < minClarity) return;

    const now = Date.now();
    if (now - lastRecordAtRef.current < minIntervalMs) return;
    lastRecordAtRef.current = now;

    const midi = freqToMidi(pitchHz);
    const note: RecordedNote = {
      pitchHz,
      clarity,
      midi,
      noteName: midi != null ? freqToNoteName(pitchHz) : "",
      timeSec,
      ts: now,
    };

    notesRef.current.push(note);
    setNotes([...notesRef.current]);
  }, [minClarity, minIntervalMs]);

  const exportNotes = useCallback((filename?: string) => {
    const data = JSON.stringify(notesRef.current, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name = filename || `session-notes-${Date.now()}.json`;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return {
    startSession,
    stopSession,
    clearNotes,
    record,
    exportNotes,
    notes,
    isRecording: runningRef.current,
  };
}
