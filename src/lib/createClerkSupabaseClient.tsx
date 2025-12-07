import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-react";

type ClerkSession = ReturnType<typeof useSession>["session"];

function createClerkSupabaseClient(
  sesion: ClerkSession | null
): ReturnType<typeof createClient> {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "",

    {
      async accessToken() {
        return sesion?.getToken() ?? null;
      },
    }
  );
}

export default createClerkSupabaseClient;
