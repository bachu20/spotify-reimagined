"use client";

import MediaItem from "@/components/media-item";
import { Song } from "@/types/common";

interface Props {
  songs: Song[];
}

const SearchContent: React.FC<Props> = ({ songs }) => {
  if (!songs.length) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No songs found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <MediaItem onClick={() => {}} song={song} />
        </div>
      ))}

      {/* TODO: Add like button later */}
    </div>
  );
};

export default SearchContent;
