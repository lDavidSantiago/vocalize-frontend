// Simple App.tsx
import React, { useState } from "react";
import { usePitchDetector } from "./hooks/usePitchTest";
import KaraokePitchComparer from "./components/PitchMonitor";
import karaokeFile from "./assets/karaoke_moon.mp3";
function App() {
  const [listening, setListening] = useState(false);

  const { pitch, clarity, setPitch, setClarity } = usePitchDetector(listening);

  const start = () => {
    setPitch(0);
    setClarity(0);
    setListening(true);
  };
  return (
    <>
      <KaraokePitchComparer audioUrl={karaokeFile} />
    </>
  );
}

export default App;
