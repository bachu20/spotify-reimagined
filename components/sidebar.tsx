"use client";

import { useState, useEffect, createContext } from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { User } from "@supabase/supabase-js";

import Box from "./box";
import SidebarItem from "./sidebar-item";
import Library from "./library";

interface SidebarProps {
  children: React.ReactNode;
}

interface ProviderValueProps {
  user: User | undefined;
  signIn(): void;
  signOut(): void;
}

export const AuthenticationContext = createContext<ProviderValueProps | null>(
  null
);

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    async function refreshSession() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (data && data.session) {
        setUser(data.session.user);
      }
    }

    if (!user) {
      refreshSession();
    }
  }, [user]);

  const handleAuth = async (logout = false) => {
    const supabase = createClient();

    if (logout) {
      await supabase.auth.signOut();
      setUser(undefined);
      return;
    }

    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const routes = useMemo(
    () => [
      {
        label: "Home",
        active: pathname !== "/search",
        href: "/",
        icon: HiHome,
      },
      {
        label: "Search",
        active: pathname === "/search",
        href: "/search",
        icon: BiSearch,
      },
    ],
    [pathname]
  );

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        signIn: async () => handleAuth(),
        signOut: async () => handleAuth(true),
      }}
    >
      <div className="flex h-full">
        <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
          <Box>
            <div className="flex flex-col gap-y-4 px-5 py-4">
              {routes.map((item) => (
                <SidebarItem key={item.label} {...item}></SidebarItem>
              ))}
            </div>
          </Box>
          <Box className="overflow-y-auto h-full">
            <Library />
          </Box>
        </div>

        <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
      </div>
    </AuthenticationContext.Provider>
  );
};

export default Sidebar;
