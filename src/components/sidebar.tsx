import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Music, Star, Flame, TrendingUp, Shuffle, Music2, Mic2, Guitar, Drum, Radio } from "lucide-react";


interface GenreContextType {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

export function GenreProvider({ children }: { children: ReactNode }) {
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  return (
    <GenreContext.Provider value={{ selectedGenre, setSelectedGenre }}>
      {children}
    </GenreContext.Provider>
  );
}

export function useGenre() {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error("useGenre debe usarse dentro de GenreProvider");
  }
  return context;
}

// ==================== SIDEBAR COMPONENT ====================
interface Genre {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const genres: Genre[] = [
  { id: "nuevos", name: "Nuevos", icon: <Music className="w-5 h-5" /> },
  { id: "popular", name: "Popular", icon: <Star className="w-5 h-5" /> },
  { id: "hot", name: "Hot", icon: <Flame className="w-5 h-5" /> },
  { id: "tendencias", name: "Tendencias", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "random", name: "Karaoke Random", icon: <Shuffle className="w-5 h-5" /> },
  { id: "ingles", name: "Cantar en Inglés", icon: <Music2 className="w-5 h-5" /> },
  { id: "balada", name: "Balada", icon: <Mic2 className="w-5 h-5" /> },
  { id: "cumbia", name: "Cumbia", icon: <Drum className="w-5 h-5" /> },
  { id: "kpop", name: "K-Pop", icon: <Radio className="w-5 h-5" /> },
  { id: "latin-urban", name: "Latin Urban", icon: <Music className="w-5 h-5" /> },
  { id: "cristiana", name: "Música Cristiana", icon: <Music2 className="w-5 h-5" /> },
  { id: "pop", name: "Pop", icon: <Star className="w-5 h-5" /> },
  { id: "pop-rock", name: "Pop Rock", icon: <Guitar className="w-5 h-5" /> },
  { id: "pop-latino", name: "Pop Latino", icon: <Music className="w-5 h-5" /> },
  { id: "reggaeton", name: "Reggaeton", icon: <Drum className="w-5 h-5" /> },
  { id: "rock", name: "Rock", icon: <Guitar className="w-5 h-5" /> },
  { id: "rock-espanol", name: "Rock en Español", icon: <Guitar className="w-5 h-5" /> },
  { id: "rnb", name: "R&B", icon: <Mic2 className="w-5 h-5" /> },
];

export default function GenreSidebar() {
  const { selectedGenre, setSelectedGenre } = useGenre();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGenreSelect = (genreId: string) => {
    const newGenre = selectedGenre === genreId ? "" : genreId;
    setSelectedGenre(newGenre);
    
    // Si no estamos en home, redirigir a home con el filtro
    if (location.pathname !== "/home") {
      navigate("/home");
    }
  };

  return (
    <aside className="w-56 bg-[#16161f] border-r border-gray-800/50 flex flex-col overflow-y-auto">
      {/* Genre List */}
      <nav className="flex-1 py-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreSelect(genre.id)}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
              selectedGenre === genre.id
                ? "bg-purple-600/20 text-white border-r-2 border-purple-600"
                : "text-gray-300 hover:bg-[#1a1a2e] hover:text-white"
            }`}
          >
            <span className={selectedGenre === genre.id ? "text-purple-400" : "text-gray-400"}>
              {genre.icon}
            </span>
            <span className="text-sm font-light">{genre.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}