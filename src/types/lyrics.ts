export type LyricsLine = {
  text: string;
  start: number;
  end: number;
};

export type LyricsData = {
  title: string;
  lines: LyricsLine[];
};



