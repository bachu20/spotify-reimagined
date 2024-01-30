"use server";

import { Song } from "@/types/common";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getSongs = async (): Promise<Song[]> => {
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};

export const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createClient(cookies());

  const sessionResponse = await supabase.auth.getSession();

  if (sessionResponse.error) {
    console.error(sessionResponse.error.message);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionResponse.data.session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};
