import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Play, ChevronLeft } from "lucide-react"

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

export default function ArtistDetailPage() {
  const navigate = useNavigate()
  const { artistId } = useParams<{ artistId: string }>()

  // Obtener las canciones del artista
  const artistSongs = useMemo(() => {
    return albums.filter(
      (album) => album.artist.toLowerCase().replace(/\s+/g, "-") === artistId
    )
  }, [artistId])

  // Obtener el nombre real del artista de las canciones
  const artistName = useMemo(() => {
    if (artistSongs.length === 0) return ""
    return artistSongs[0].artist
  }, [artistSongs])

  // Obtener la imagen del artista (primera canción)
  const artistImage = artistSongs[0]?.coverImage

  const handleSongClick = (albumId: string) => {
    navigate(`/karaoke?albumId=${albumId}`)
  }

  const handleBack = () => {
    navigate("/artistas")
  }

  return (
    <div className="flex-1 px-4 md:px-20 py-8 overflow-y-auto">
      {/* Header con botón atrás */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a2e] hover:bg-[#262634] transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl md:text-4xl font-light text-white">{artistName}</h1>
      </div>

      {/* Información del artista */}
      {artistImage && (
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-[#1a1a2e] shrink-0">
            <img
              src={artistImage}
              alt={artistName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Artista</p>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">{artistName}</h2>
            <p className="text-gray-300 text-lg">
              {artistSongs.length} canción{artistSongs.length !== 1 ? "es" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Lista de canciones */}
      {artistSongs.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl mb-2">No se encontraron canciones</p>
          <p className="text-sm">Este artista no tiene canciones disponibles</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-light text-gray-400 mb-6">Canciones</h3>
          {artistSongs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => handleSongClick(song.id)}
              className="group flex items-center gap-4 p-4 rounded-lg bg-[#16161f] hover:bg-[#1a1a2e] transition-colors cursor-pointer"
            >
              {/* Número */}
              <span className="text-gray-500 font-light text-sm min-w-[30px]">
                {index + 1}
              </span>

              {/* Imagen de la canción */}
              <div className="relative w-14 h-14 rounded overflow-hidden bg-[#0f0f15] shrink-0">
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Información de la canción */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-base font-light truncate">{song.title}</p>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>

              {/* Botón play */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSongClick(song.id)
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Play className="w-5 h-5 text-white fill-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
