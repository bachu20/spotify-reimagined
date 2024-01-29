import { useContext } from "react";
import { SupabaseProviderContext } from "@/providers/supabase";
import { Song } from "@/types/common";

const useLoadImage = (song: Song) => {
  const { supabase } = useContext(SupabaseProviderContext);

  if (!song) {
    return null;
  }

  const response = supabase.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return response.data.publicUrl;
};

export default useLoadImage;
