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

export const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createClient(cookies());
  const sessionResponse = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", sessionResponse.data.session?.user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({ ...item.songs }));
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

export const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = createClient(cookies());

  if (!title) {
    return getSongs();
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};

