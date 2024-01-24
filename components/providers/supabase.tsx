"use client";

import { useState, useEffect, createContext } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Session,
  AuthChangeEvent,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Database } from "@/types/database";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

interface Props {
  supabase: SupabaseClient<Database>;
  session: Session | undefined;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

export const SupabaseProviderContext = createContext<Props | undefined>(
  undefined
);

const SuperbaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | undefined>(undefined);

  const supabase = createClient();

  useEffect(() => {
    async function updateSession() {
      const { data } = await supabase.auth.getSession();

      if (data && data.session) {
        setSession(data.session);
      }
    }

    updateSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session || undefined);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SupabaseProviderContext.Provider
      value={{ supabase, session, signIn, signOut }}
    >
      {children}
    </SupabaseProviderContext.Provider>
  );
};

export default SuperbaseProvider;
