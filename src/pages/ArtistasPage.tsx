import { useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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

export default function ArtistasPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedGenre } = useGenre()

  const query = new URLSearchParams(location.search).get("q") || ""

  // Extraer artistas únicos y contar sus canciones
  const artists = useMemo(() => {
    const artistMap = new Map<string, { count: number; image: string; genre: string }>()

    albums.forEach((album) => {
      if (!artistMap.has(album.artist)) {
        artistMap.set(album.artist, {
          count: 0,
          image: album.coverImage,
          genre: album.genre || "",
        })
      }
      const artist = artistMap.get(album.artist)!
      artist.count++
    })

    return Array.from(artistMap.entries()).map(([name, data]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      image: data.image,
      songCount: data.count,
      genre: data.genre,
    }))
  }, [])

  // Filtrar artistas
  const filteredArtists = useMemo(() => {
    let filtered = artists

    // Filtrar por búsqueda
    if (query) {
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filtrar por género seleccionado
    if (selectedGenre) {
      filtered = filtered.filter((artist) => artist.genre === selectedGenre)
    }

    return filtered
  }, [query, selectedGenre, artists])

  const handleArtistClick = (artistId: string) => {
    navigate(`/artista/${artistId}`)
  }

  return (
    <div className="flex-1 px-4 md:px-20 py-8 overflow-y-auto">
      {filteredArtists.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl mb-2">No se encontraron artistas</p>
          <p className="text-sm">Intenta con otro filtro o búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="group cursor-pointer"
              onClick={() => handleArtistClick(artist.id)}
            >
              {/* Imagen circular del artista */}
              <div className="relative aspect-square rounded-full overflow-hidden mb-4 bg-[#1a1a2e]">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay oscuro al hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-sm font-medium">{artist.songCount} canción{artist.songCount !== 1 ? "es" : ""}</p>
                  </div>
                </div>
              </div>

              {/* Información del artista */}
              <div className="text-center">
                <p className="text-white text-sm md:text-base font-light truncate uppercase tracking-wider">
                  {artist.name}
                </p>
                <p className="text-gray-400 text-xs md:text-sm truncate font-light">
                  {artist.songCount} canción{artist.songCount !== 1 ? "es" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
