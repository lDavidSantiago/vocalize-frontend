import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import KaraokePage from "./pages/KaraokePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: redirige según el estado de autenticación */}
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

        {/* Página de inicio de sesión */}
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

        {/* Página de inicio protegida */}
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

        {/* Página de karaoke protegida */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
