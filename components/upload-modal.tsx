import { useContext, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useUploadModal from "@/hooks/useUploadModal";
import uniqid from "uniqid";
import Modal from "./modal";
import Input from "./input";
import Button from "./button";
import toast from "react-hot-toast";
import { SupabaseProviderContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useContext(SupabaseProviderContext);
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        throw new Error("Missing fields");
      }

      const uniqID = uniqid();

      // Upload song
      const songUploadResp = await supabase.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songUploadResp.error) {
        throw new Error("Failed song upload");
      }

      // Upload image
      const imageUploadResp = await supabase.storage
        .from("images")
        .upload(`image-${values.title}-${uniqID}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageUploadResp.error) {
        throw new Error("Failed image upload");
      }

      const insertResponse = await supabase.from("songs").insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        song_path: songUploadResp.data.path,
        image_path: imageUploadResp.data.path,
      });

      if (insertResponse.error) {
        throw insertResponse.error;
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song uploaded!");
      uploadModal.onClose();
    } catch (error) {
      toast.error((error as Error)?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />

        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
