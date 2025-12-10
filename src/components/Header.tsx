import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./logo";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    setSearchQuery(q ?? "");
  }, [location.search]);

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/home?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 md:h-24 z-50 bg-[#0f0f15] border-b border-[#3f3f46]">
      <div className="w-full max-w-screen px-3 md:px-4 h-full">
        <div className="flex items-center justify-between gap-2 md:gap-4 h-full">
          
          {/* LEFT: LOGO */}
          <div className="shrink-0 flex items-center gap-2 md:gap-4">
            <Link to="/home" className="flex items-center gap-2 md:gap-4">
              <Logo />
              <h1 className="text-lg md:text-2xl font-light tracking-wide text-white">Vocalize</h1>
            </Link>
          </div>

          {/* CENTER: NAV BUTTONS */}
          <SignedIn>
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center gap-12 md:gap-24 text-xl">
                <Link
                  to="/home"
                  className={`px-4 md:px-6 py-2 rounded-lg text-sm md:text-base transition font-medium ${
                    isActive("/home")
                      ? "bg-[#1a1a2e] text-white border border-purple-600"
                      : "text-white hover:text-white hover:bg-[#1a1a2e]"
                  }`}
                >
                  Inicio
                </Link>
                
                 <Link
                  to="/artistas"
                  className={`px-4 md:px-6 py-2 rounded-lg text-sm transition font-medium ${
                    isActive("/artistas")
                      ? "bg-[#1a1a2e] text-white border border-purple-600"
                      : "text-white hover:text-white hover:bg-[#1a1a2e]"
                  }`}
                >
                  Artistas
                </Link>
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-[#1a1a2e] px-3 py-2 rounded-lg border-2 border-transparent hover:border-purple-600 transition">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent text-sm text-white outline-none w-32 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </SignedIn>

          {/* RIGHT: SEARCH + USER */}
          <div className="shrink-0 min-w-[30px] flex items-center justify-end gap-3 md:gap-5">


            {/* USER ICON */}
            <SignedIn>
              <div className="shrink-0">
                <UserButton />
              </div>
            </SignedIn>
          </div>
          
        </div>
      </div>
    </header>
  );
}