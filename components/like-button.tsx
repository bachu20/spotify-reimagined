import { useUser } from "@/hooks/useUser";
import { SupabaseProviderContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import useAuthModal from "@/hooks/useAuthModal";

interface Props {
  songId: string;
}

const LikeButton: React.FC<Props> = ({ songId }) => {
  const { supabase } = useContext(SupabaseProviderContext);
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const authModal = useAuthModal();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const response = await supabase
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!response.error && response.data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabase, user?.id]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const queryResponse = await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (queryResponse.error) {
        toast.error(queryResponse.error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const insertResponse = await supabase.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id,
      });

      if (insertResponse.error) {
        toast.error(insertResponse.error.message);
      } else {
        setIsLiked(true);
        toast.success("Liked");
      }
    }

    router.refresh();
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;
  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#22C55E" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
