"use client";

import { useContext, useEffect } from "react";
import { SupabaseProviderContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import Modal from "./modal";
import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  const router = useRouter();
  const { supabase, session } = useContext(SupabaseProviderContext);
  const { onClose, isOpen } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={(open: boolean) => !open && onClose()}
    >
      <Auth
        magicLink
        theme="dark"
        providers={["google"]}
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22C55E",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
