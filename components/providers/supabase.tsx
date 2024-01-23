"use client";

import { useState, useEffect, createContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface SupabaseProviderProps {
  children: React.ReactNode;
}

interface ProviderProps {
  user: User | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

export const SupabaseProviderContext = createContext<ProviderProps | null>(
  null
);

const SuperbaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    console.log("use effect called");
    async function updateSession() {
      const { data } = await supabase.auth.getSession();

      if (data && data.session) {
        setUser(data.session.user);
      }
    }

    updateSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("use effect <on session change> called");

        setUser(session?.user ?? null);
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
    <SupabaseProviderContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </SupabaseProviderContext.Provider>
  );
};

export default SuperbaseProvider;
