{/*Reproduce la canción y muestra el tiempo actual*/}

import { useEffect, useRef, useState } from "react";

interface SongPlayerProps {
  src: string;
  onTimeChange?: (time: number) => void;
  onPlayingChange?: (playing: boolean) => void;
}

export default function SongPlayer({
  src,
  onTimeChange,
  onPlayingChange,
}: SongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeChange?.(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [onTimeChange]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
    setIsPlaying(true);
    onPlayingChange?.(true);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    onPlayingChange?.(false);
  };

  const reset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    onTimeChange?.(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={togglePlayPause}
        className="appearance-none bg-[#1b1b28] text-white px-4 py-2 rounded-md"
      >
        {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
      </button>
      <button
        onClick={reset}
        className="appearance-none bg-[#1b1b28] text-white px-4 py-2 rounded-md"
      >
        ⏮️ Reiniciar
      </button>
      <div className="ml-auto text-gray-200 text-sm">
        Tiempo: {currentTime.toFixed(2)}s
      </div>
      <audio ref={audioRef} src={src} />
    </div>
  );
}


