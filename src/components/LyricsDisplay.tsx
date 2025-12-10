import { useMemo } from "react";
import type { LyricsLine, LyricsData } from "../types/lyrics";

export type { LyricsLine, LyricsData };

interface LyricsDisplayProps {
  lyrics: LyricsData;
  currentTime: number;
  playing: boolean;
}

export default function LyricsDisplay({
  lyrics,
  currentTime,
  playing,
}: LyricsDisplayProps) {
  // Encontrar la línea actual y las líneas anteriores/próximas
  const visibleLines = useMemo(() => {
    if (!lyrics || !lyrics.lines || lyrics.lines.length === 0) {
      return { current: -1, lines: [] };
    }

    const currentIndex = lyrics.lines.findIndex(
      (line, index) =>
        currentTime >= line.start &&
        (currentTime < line.end || index === lyrics.lines.length - 1)
    );

    // Si no hay línea actual, buscar la próxima
    let activeIndex = currentIndex;
    if (activeIndex === -1) {
      activeIndex = lyrics.lines.findIndex((line) => currentTime < line.start);
      if (activeIndex === -1) {
        activeIndex = lyrics.lines.length - 1;
      }
    }

    // Mostrar líneas anteriores, actual y próximas
    const beforeCount = 2;
    const afterCount = 3;
    const startIndex = Math.max(0, activeIndex - beforeCount);
    const endIndex = Math.min(
      lyrics.lines.length,
      activeIndex + afterCount + 1
    );

    return {
      current: activeIndex,
      lines: lyrics.lines.slice(startIndex, endIndex),
      startIndex,
    };
  }, [lyrics, currentTime]);

  if (!lyrics || !lyrics.lines || lyrics.lines.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400 text-lg">
        No hay letras disponibles para esta canción
      </div>
    );
  }

  // Calcular el progreso de la línea actual
  const getLineProgress = (line: LyricsLine, index: number) => {
    if (index !== visibleLines.current || !playing) return 0;
    if (currentTime < line.start) return 0;
    if (currentTime >= line.end) return 1;

    const lineDuration = line.end - line.start;
    const elapsed = currentTime - line.start;
    return Math.min(1, Math.max(0, elapsed / lineDuration));
  };

  return (
    <div className="mt-8 min-h-[500px] flex flex-col justify-center items-center">
      <div className="space-y-8 w-full max-w-4xl">
        {visibleLines.lines.map((line, idx) => {
          const absoluteIndex = visibleLines.startIndex + idx;
          const isCurrent = absoluteIndex === visibleLines.current;
          const isPast = absoluteIndex < visibleLines.current;
          const isFuture = absoluteIndex > visibleLines.current;
          const progress = getLineProgress(line, absoluteIndex);

          // Omitir líneas vacías si no son la actual
          if (!line.text.trim() && !isCurrent) {
            return null;
          }

          return (
            <div
              key={absoluteIndex}
              className={`transition-all duration-500 ease-in-out text-center ${
                isCurrent
                  ? "text-4xl font-bold text-white transform scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  : isPast
                  ? "text-xl text-gray-500 opacity-40 transform scale-95"
                  : "text-xl text-gray-400 opacity-60 transform scale-100"
              }`}
            >
              {line.text.trim() ? (
                <div className="relative py-2">
                  <span
                    className={`inline-block transition-all duration-300 ${
                      isCurrent
                        ? "text-yellow-300 font-extrabold tracking-wide"
                        : ""
                    }`}
                  >
                    {line.text}
                  </span>
                  {/* Indicador de progreso para la línea actual */}
                  {isCurrent && playing && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-yellow-400/30 rounded-full overflow-hidden" style={{ width: '60%' }}>
                      <div 
                        className="h-full bg-linear-to-r from-yellow-400 via-yellow-300 to-transparent transition-all duration-100 rounded-full"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                  {/* Efecto de brillo sutil para la línea actual */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-yellow-400/10 to-transparent blur-xl pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="h-8" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

