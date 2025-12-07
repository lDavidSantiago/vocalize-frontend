import {
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/home" replace />
      </SignedIn>
      <SignedOut>
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0f0f15] text-white p-6">
          {/*Título*/}
          <div className="relative flex items-center justify-center w-full max-w-md mb-8">
            {/* Elemento visual circulo */}
            <div className="absolute w-40 h-40 bg-purple-600/20 rounded-full blur-2xl animate-pulse ease-in-out"></div>

            {/* Líneas + texto */}
            <div className="flex items-center w-full">
              <span className="flex-1 h-px bg-gray-200/50"></span>
              <h1 className="mx-4 text-4xl font-syncopate tracking-[0.3em] text-white">
                VOCALIZE
              </h1>
              <span className="flex-1 h-px bg-gray-200/50"></span>
            </div>
          </div>

          {/* Contenido principal */}
          <header className="w-full max-w-md bg-[#161625] rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-center mt-10">
            <p className="text-gray-300 text-center text-lg mb-4">
              Welcome, please sign in to continue
            </p>
            {/* //TODO: Verificar los colores de botones y  fondos con el figma 
            // */}

            <SignInButton mode="modal" redirectUrl="/home">
              <button className="btn px-6 py-3 text-lg">Sign In</button>
            </SignInButton>
          </header>
        </main>
      </SignedOut>
    </>
  );
}

export default SignInPage;

