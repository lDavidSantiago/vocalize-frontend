import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import KaraokePage from "./pages/KaraokePage";
import Navbar from "./components/Header";
import GenreSidebar, { GenreProvider } from "./components/sidebar";
import { useState } from "react";


function AppContent() {
  const location = useLocation();
  
  // Verificar si estamos en la página de sign-in
  const isSignInPage = location.pathname === "/sign-in";

  return (
    <>
      {/* Header se muestra en todas las páginas */}
      <Navbar />
      
      {/* Layout con sidebar solo para páginas autenticadas */}
      {!isSignInPage ? (
        <div className="min-h-screen bg-[#0f0f1a] text-white flex pt-20">
          <SignedIn>
            {/* Sidebar de géneros */}
            <GenreSidebar />
          </SignedIn>

          {/* Contenido principal */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <Navigate to="/home" replace />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/sign-in" replace />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/home"
                element={
                  <>
                    <SignedIn>
                      <HomePage />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/sign-in" replace />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/karaoke"
                element={
                  <>
                    <SignedIn>
                      <KaraokePage />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/sign-in" replace />
                    </SignedOut>
                  </>
                }
              />

              <Route
                path="/genero"
                element={
                  <>
                    <SignedIn>
                      <div className="flex-1 p-8">
                        <h1 className="text-2xl">Página de Género</h1>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/sign-in" replace />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </main>
        </div>
      ) : (
        // Página de Sign In sin sidebar
        <Routes>
          <Route
            path="/sign-in"
            element={
              <>
                <SignedIn>
                  <Navigate to="/home" replace />
                </SignedIn>
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              </>
            }
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GenreProvider>
        <AppContent />
      </GenreProvider>
    </BrowserRouter>
  );
}

export default App;