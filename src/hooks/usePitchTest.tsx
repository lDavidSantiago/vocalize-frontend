import { PitchDetector } from "pitchy";
import { useEffect, useRef, useState } from "react";

export function usePitchDetector(active: boolean) {
  const [pitch, setPitch] = useState<number>(0);
  const [clarity, setClarity] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // FLAG para detener el loop
  const runningRef = useRef(false);

  function updatePitch(analyserNode, detector, input, sampleRate) {
    if (!runningRef.current) return; // ← DETIENE EL LOOP

    analyserNode.getFloatTimeDomainData(input);
    const [p, c] = detector.findPitch(input, sampleRate);
    if (c > 0.75 && p > 20 && p < 2000) {
      console.log("Pitch detected:", p, "Clarity:", c);
      setPitch(p || 0);
      setClarity(c || 0);
    } else {
      setPitch(0);
      setClarity(0);
    }

    setTimeout(
      () => updatePitch(analyserNode, detector, input, sampleRate),
      100
    );
  }

  useEffect(() => {
    if (!active) {
      runningRef.current = false;
      return;
    }

    runningRef.current = true;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyserNode = audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      streamRef.current = stream;

      audioContext.createMediaStreamSource(stream).connect(analyserNode);

      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      const input = new Float32Array(detector.inputLength);

      updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    });

    return () => {
      runningRef.current = false;

      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContext.close();
    };
  }, [active]);

  return { pitch, clarity, setPitch, setClarity };
}
