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
}

const supabase = createClient();

export const SupabaseProviderContext = createContext<Props>({
  supabase,
  session: undefined,
});

const SuperbaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | undefined>(undefined);

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

  return (
    <SupabaseProviderContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseProviderContext.Provider>
  );
};

export default SuperbaseProvider;
