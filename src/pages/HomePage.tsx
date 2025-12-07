
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Play, User } from "lucide-react"

interface Album {
  id: string
  title: string
  artist: string
  coverImage: string

}


const albums: Album[] = [
  {
    id: "1",
    title: "Las noches",
    artist: "Junior H",
    coverImage: "/dark-atmospheric-album-cover-with-angel.jpg",
  },
  {
    id: "2",
    title: "Video games",
    artist: "Lana Del Rey",
    coverImage: "/vintage-lana-del-rey-paradise-album.jpg",
  },
  {
    id: "3",
    title: "El amar y el querer",
    artist: "José José",
    coverImage: "/jose-jose-classic-portrait-album.jpg",
  },
  {
    id: "4",
    title: "Tú con él",
    artist: "Frankie Ruiz",
    coverImage: "/frankie-ruiz-pop-art-blue-yellow.jpg",
  },
  {
    id: "5",
    title: "Reminiscencias",
    artist: "Julio Jaramillo",
    coverImage: "/vintage-latin-music-album-yellow.jpg",
  },
  {
    id: "6",
    title: "Mojabi Ghost",
    artist: "Tainy",
    coverImage: "/anime-character-dramatic-expression.jpg",

  },
  {
    id: "7",
    title: "Borro Cassette",
    artist: "Maluma",
    coverImage: "/maluma-pretty-boy-dirty-boy-album.jpg",
 
  },
  {
    id: "8",
    title: "El bolero",
    artist: "Yami Safdie, Milo J",
    coverImage: "/modern-female-artist-with-guitar-pink.jpg",

  },
]

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleAlbumClick = (album: Album) => {
    navigate(`/karaoke?albumId=${album.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex">
      {/* Sidebar alfabético */}
      <aside className="w-12 flex flex-col items-center py-8 border-r border-gray-800/50">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className="w-8 h-7 flex items-center justify-center text-xs text-gray-400 hover:text-white transition-colors font-light"
            onClick={() => {
              console.log(`Filter by letter: ${letter}`)
            }}
          >
            {letter}
          </button>
        ))}
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full px-8 py-6 flex items-center justify-between">
          {/* Logo centrado */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-6">
              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gray-400 to-gray-400"></div>
              <h1 className="text-3xl font-light tracking-[0.5em] text-white uppercase">vocalize</h1>
              <div className="h-[1px] w-32 bg-gradient-to-l from-transparent via-gray-400 to-gray-400"></div>
            </div>
          </div>

          {/* Búsqueda y perfil */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#6366f1]/20 border border-[#6366f1]/30 text-white placeholder-gray-500 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6366f1]/50 w-48 backdrop-blur-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>
            <button className="w-10 h-10 rounded-full bg-[#8b7bb8] flex items-center justify-center hover:bg-[#9d8dc8] transition-colors">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        {/* Grid de álbumes */}
        <div className="flex-1 px-20 py-8 overflow-y-auto">
          <div className="grid grid-cols-4 gap-x-8 gap-y-10 max-w-7xl mx-auto">
            {albums.map((album) => (
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
                      className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAlbumClick(album)
                      }}
                    >
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </button>
                  </div>
                </div>

                {/* Información del álbum */}
                <div className="bg-[#16161f] rounded-lg px-4 py-3 flex items-center gap-3">
                  <button 
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAlbumClick(album)
                    }}
                  >
                    <Play className="w-4 h-4 text-white fill-white" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-light truncate uppercase tracking-wider">{album.title}</p>
                    <p className="text-gray-400 text-xs truncate font-light">{album.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
