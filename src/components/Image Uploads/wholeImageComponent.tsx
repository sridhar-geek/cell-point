"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/Image Uploads/imageUpload";
import ImagePreviewer from "@/components/Image Uploads/imagePreviewer";
// import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";
import Spinner from "../Skeleton/spinner";
import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { handleTokenRefresh } from "@/lib/common";
// import Spinner from "./spinner";

type BannerImagesProp = {
  supabaseStorage: string[];
  onSave: (images: string[]) => void;
};

const BannerImages = ({ supabaseStorage, onSave }: BannerImagesProp) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  // Sync `supabaseStorage` to state when received
  useEffect(() => {
    if (supabaseStorage.length > 0) {
      setSupabaseImages(supabaseStorage);
    }
  }, [supabaseStorage]);

  // Handle image upload
  const handleUpload = (images: File[]) => {
    setUploadedImages(images);
  };

  // Handle image delete
  const handleDelete = async (index: number, isSupabaseImage: boolean) => {
    if (isSupabaseImage) {
      const deletedImage = supabaseImages[index]; // Get the image to delete

      if (!deletedImage) {
        console.error("No image found at index:", index);
        return;
      }

      setIsDelete(true);

      const success = await deletImageFromStorage(deletedImage);

      if (success) {
        // Remove from state only if deletion is successful
        setSupabaseImages((prevImages) =>
          prevImages.filter((_, i) => i !== index)
        );
      }

      setIsDelete(false);
    } else {
      setUploadedImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    }
  };

  // Handle saving images
  const handleSave = async () => {
    setIsUpload(true);
    try {
      // sending images to the storage and get the url
      const uploadedImageUrls = await uploadImagesToSupabase(uploadedImages);
      const updatedImages = [...supabaseImages, ...uploadedImageUrls];
      onSave(updatedImages);
      setIsUpload(false);
      alert("Images upladed successfully!");
    } catch (error) {
      setIsUpload(false);
      console.error("Error saving images:", error);
      alert("Failed to upload images.");
    }
  };

  const getUpdatedSession = async () => {
    const data = localStorage.getItem("supabaseSession");
    const session = data ? JSON.parse(data) : null;

    if (!session || !session.access_token || !session.refresh_token) {
      console.error("No session found");
      return null;
    }

    const { accessToken, refreshToken } = await handleTokenRefresh(
      session.access_token,
      session.refresh_token
    );

    session.access_token = accessToken;
    session.refresh_token = refreshToken;

    // Update session in local storage
    localStorage.setItem("supabaseSession", JSON.stringify(session));

    return session;
  };

  const deletImageFromStorage = async (image: string): Promise<boolean> => {
    const session = await getUpdatedSession();
    if (!session) return false;

    const filePath = image.split("/").pop();
    if (!filePath) {
      console.error("Invalid file path");
      return false;
    }

    try {
      const { data, error } = await getSupabaseClient(session.access_token)
        .storage.from("images")
        .remove([filePath]);
      console.log("data from supabase delete", data);
      if (error) {
        console.error("Error deleting image from Supabase storage:", error);
        alert("Error Deleting image");
        return false;
      }

      alert("Image deleted Successfully");
      return true;
    } catch (error) {
      console.error("Error deleting image from Supabase storage:", error);
      return false;
    }
  };
  const uploadImagesToSupabase = async (images: File[]): Promise<string[]> => {
    const session = await getUpdatedSession();
    if (!session) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const filePath = `${Date.now()}-${image.name}`;
      const { error } = await getSupabaseClient(session.access_token)
        .storage.from("images")
        .upload(filePath, image);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };
  return (
    <div>
      {isDelete ? (
        <Spinner name="Deleting" />
      ) : (
        <div>
          <ImagePreviewer
            supabaseImages={supabaseImages}
            uploadedImages={uploadedImages}
            onDelete={handleDelete}
          />
          <ImageUploader onUpload={handleUpload} />
          <Button onClick={handleSave}>
            {isUpload ? <Spinner name={"Updating..."} /> : "Save Images"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BannerImages;
