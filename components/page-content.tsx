"use client";

import { Song } from "@/types/common";
import SongItem from "./song-item";
import useOnPlay from "@/hooks/useOnPlay";

interface Props {
  songs: Song[];
}

const PageContent: React.FC<Props> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (!songs.length) {
    return <div className="mt-4 text-neutral-400">No songs available.</div>;
  }

  return (
    <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
      {songs.map((song) => (
        <SongItem
          key={song.id}
          onClick={(id: string) => onPlay(id)}
          song={song}
        />
      ))}
    </div>
  );
};

export default PageContent;
