import { useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Play } from "lucide-react"
import { useGenre } from "../components/sidebar"

interface Album {
  id: string
  title: string
  artist: string
  coverImage: string
  genre?: string
}

const albums: Album[] = [
  {
    id: "1",
    title: "Tu Falta De Querer",
    artist: "Mon Laferte",
    coverImage: "https://i.scdn.co/image/ab67616d0000b2737305e93e2a938b458f9773c0",
    genre: "pop-latino",
  },
  {
    id: "2",
    title: "El Fornicador",
    artist: "Piter-G",
    coverImage: "https://i.scdn.co/image/ab67616d00001e02571d22f1feca803b712f33a4",
    genre: "cumbia",
  },
  {
    id: "3",
    title: "Pretty Girl",
    artist: "Clairo",
    coverImage: "https://i.scdn.co/image/ab67616d0000b273b9c93163c53545df6182e7ef",
    genre: "pop",
  },
  {
    id: "4",
    title: "Recently",
    artist: "Liana Flores",
    coverImage: "https://i.scdn.co/image/ab67616d0000b2737e4192ad68817a0460a6fa71",
    genre: "pop",
  },
  {
    id: "5",
    title: "Stay With Me",
    artist: "miki matsubara",
    coverImage: "https://i.scdn.co/image/ab67616d00001e0281052badd62d5e14c3377786",
    genre: "balada",
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedGenre } = useGenre()
  
  const query = new URLSearchParams(location.search).get("q") || ""

  const filteredAlbums = useMemo(() => {
    let filtered = albums

    // Filtrar por búsqueda
    if (query) {
      filtered = filtered.filter((album) =>
        album.title.toLowerCase().includes(query.toLowerCase()) ||
        album.artist.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filtrar por género seleccionado
    if (selectedGenre) {
      filtered = filtered.filter((album) => album.genre === selectedGenre)
    }

    return filtered
  }, [query, selectedGenre])

  const handleAlbumClick = (album: Album) => {
    navigate(`/karaoke?albumId=${album.id}`)
  }

  return (
    <div className="flex-1 px-4 md:px-20 py-8 overflow-y-auto">
      {/* Indicador de filtro activo */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl mb-2">No se encontraron canciones</p>
          <p className="text-sm">Intenta con otro filtro o búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {filteredAlbums.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer"
              onClick={() => handleAlbumClick(album)}
            >
              {/* Portada del álbum */}
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-[#1a1a2e]">
                <img
                  src={album.coverImage || "/placeholder.svg"}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
                {/* Botón de play overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    className="w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAlbumClick(album)
                    }}
                  >
                    <Play className="w-5 md:w-7 h-5 md:h-7 text-white fill-white ml-1" />
                  </button>
                </div>
              </div>

              {/* Información del álbum */}
              <div className="bg-[#16161f] rounded-lg px-4 py-3 flex items-center gap-3">
                <button 
                  className="w-8 h-8 flex items-center justify-center shrink-0 hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAlbumClick(album)
                  }}
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs md:text-sm font-light truncate uppercase tracking-wider">{album.title}</p>
                  <p className="text-gray-400 text-xs truncate font-light">{album.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}