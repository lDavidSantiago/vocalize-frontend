{/*Página de Partida de Karaoke*/}

import { useEffect, useState } from "react";
import { usePitchDetector } from "../hooks/usePitchTest";
import MidiVisualizer from "../components/MidiVisualizer";
import PitchMonitor from "../components/PitchMonitor";
import SongPlayer from "../components/SongPlayer";
import notesJson from "../data/miditufaltadequerer.mid_extracted.json";
import audioFile from "../assets/karaoke_moon.mp3";

export default function KaraokePage() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [expectedPitch, setExpectedPitch] = useState(0);
  const { pitch, clarity } = usePitchDetector(playing);

  const notes = notesJson.notes as Array<{ note: number; freq_hz: number; start: number; end: number; duration: number }>;

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
          src={audioFile}
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
        <div className="mt-4 text-lg text-gray-100">
          Hoy volví a dormir en nuestra cama
          Y todo sigue igual
          El aire y nuestros gatos, nada cambiará
          Difícil olvidarte estando aquí, oh, oh, oh

          Te quiero ver
          Aún te amo, y creo que hasta más que ayer
          La hiedra venenosa no te deja ver
          Me siento mutilada y tan pequeña, ah, ah, ah

          Ven y cuéntame la verdad
          Ten piedad
          Y dime por qué, no, no-no, oh

          ¿Cómo fue que me dejaste de amar?
          Yo aún podía soportar
          Tu tanta falta de querer

          Hace un mes solía escucharte
          Y ser tu cómplice
          Pensé que ya no había nadie más que tú
          Yo fui tu amiga y fui tu compañera, ah, ah, ah

          Ahora dormiré
          Muy profundamente, para olvidar
          Quisiera hasta la muerte, para no pensar
          Me forro pa' quitarme esta amargura, ah, ah, ah

          Ven y cuéntame la verdad
          Ten piedad
          Y dime por qué, no, no-no, oh

          ¿Cómo fue que me dejaste de amar?
          Yo aún podía soportar
          Tu tanta falta de querer

          Ven y cuéntame la verdad
          Ten piedad
          Y dime por qué, no, no-no, oh

          ¿Cómo fue que me dejaste de amar?
          Yo aún podía soportar
          Tu tanta falta de querer
        </div>
      </div>
    </div>
  );
}