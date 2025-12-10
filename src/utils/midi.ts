export function freqToMidi(freq: number) {
	if (!freq || freq <= 0) return null;

	const midi = 69 + 12 * Math.log2(freq / 440);
	return Math.round(midi);
}

export function midiToFreq(midi: number) {
	return 440 * Math.pow(2, (midi - 69) / 12);
}

const NOTE_NAMES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];

export function midiToNoteName(midi: number) {
	if (midi == null || isNaN(midi)) return "";
	const octave = Math.floor(midi / 12) - 1;
	const name = NOTE_NAMES[midi % 12];
	return `${name}${octave}`;
}

export function freqToNoteName(freq: number) {
	const midi = freqToMidi(freq);
	if (midi == null) return "";
	return midiToNoteName(midi);
}

