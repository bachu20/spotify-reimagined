import { useContext } from "react";
import { SupabaseProviderContext } from "@/providers/supabase";
import { Song } from "@/types/common";

const useLoadSong = (song: Song) => {
  const { supabase } = useContext(SupabaseProviderContext);

  if (!song) {
    return null;
  }

  const response = supabase.storage.from("songs").getPublicUrl(song.song_path);
  return response.data.publicUrl;
};

export default useLoadSong;
