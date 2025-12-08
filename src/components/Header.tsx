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
    <header className="bg-[#0f0f15] sticky top-0 z-50 border-b border-gray-700">
      <div style={{ width: '100%', maxWidth: '100vw', padding: '0px 16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* LEFT: LOGO */}
          <div style={{ minWidth: '180px', flexShrink: 0 }}>
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo />
              <h1 className="text-xl font-light tracking-wide text-white">Vocalize</h1>
            </Link>
          </div>

          {/* CENTER: NAV BUTTONS */}
          <SignedIn>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '100px', fontSize: '20px' }}>
                <Link
                  to="/home"
                  className={`px-6 py-2 rounded-lg text-md transition font-medium ${
                    isActive("/home")
                      ? "bg-[#1a1a2e] text-white border border-purple-600"
                      : "text-white hover:text-white hover:bg-[#1a1a2e]"
                  }`}
                >
                  Inicio
                </Link>

                <Link
                  to="/genero"
                  className={`px-6 py-2 rounded-lg text-sm transition font-medium ${
                    isActive("/genero")
                      ? "bg-[#1a1a2e] text-white border border-purple-600"
                      : "text-white hover:text-white hover:bg-[#1a1a2e]"
                  }`}
                >
                  Género
                </Link>
                 <Link
                  to="/artistas"
                  className={`px-6 py-2 rounded-lg text-sm transition font-medium ${
                    isActive("/artistas")
                      ? "bg-[#1a1a2e] text-white border border-purple-600"
                      : "text-white hover:text-white hover:bg-[#1a1a2e]"
                  }`}
                >
                  Artistas
                </Link>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1a1a2e', padding: '8px 12px', borderRadius: '8px', border: '2px solid white' }}>
              <Search size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Buscar..."
                style={{ backgroundColor: 'transparent', fontSize: '14px', color: 'white', outline: 'none', width: '120px', border: 'none' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </SignedIn>

          {/* RIGHT: SEARCH + USER */}
          <div style={{ minWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', flexShrink: 0 }}>


            {/* USER ICON */}
            <SignedIn>
              <div style={{ flexShrink: 0 }}>
                <UserButton />
              </div>
            </SignedIn>
          </div>
          
        </div>
      </div>
    </header>
  );
}