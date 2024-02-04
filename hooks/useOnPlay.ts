import { Song } from "@/types/common";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscribeModal();
  const { user, subscription } = useUser();

  return (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscriptionModal.onOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };
};

export default useOnPlay;
