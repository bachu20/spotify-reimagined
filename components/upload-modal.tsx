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
  const [isManualUpload, setIsManualUpload] = useState(false);
  const { supabase } = useContext(SupabaseProviderContext);
  const { user } = useUser();
  const { onClose, isOpen } = useUploadModal();
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
      onClose();
    }
  };

  const onUploadSuccess = () => {
    router.refresh();
    onClose();
    setIsLoading(false);
    reset();

    toast.success("Song uploaded!");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];

      let songFile;

      // set the songFile
      if (isManualUpload) {
        songFile = values.song?.[0];
      } else {
        const youtubeURL = values.youtubeURL;
      }

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

      onUploadSuccess();
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
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {!isManualUpload ? (
          <>
            <span className="inline-block text-center">
              <a
                onClick={() => setIsManualUpload(true)}
                className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-100 ease-in-out"
              >
                Want to upload manually?
              </a>
            </span>

            <Input
              id="youtubeURL"
              disabled={isLoading}
              {...register("youtubeURL", { required: true })}
              placeholder="YouTube URL"
            />
          </>
        ) : (
          <>
            <span className="inline-block text-center">
              <a
                onClick={() => setIsManualUpload(false)}
                className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-100 ease-in-out"
              >
                Want to upload with a YouTube link?
              </a>
            </span>

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
          </>
        )}

        <Button disabled={isLoading} type="submit">
          {isManualUpload ? "Create" : "Upload"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
