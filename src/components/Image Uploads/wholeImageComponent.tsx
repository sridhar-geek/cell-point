"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/Image Uploads/imageUpload";
import ImagePreviewer from "@/components/Image Uploads/imagePreviewer";
import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";
import Spinner from "../Skeleton/spinner";
// import Spinner from "./spinner";

type BannerImagesProp = {
  supabaseStorage: string[];
  onSave: (images: string[]) => void;
};

const BannerImages = ({ supabaseStorage, onSave }: BannerImagesProp) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  // const [isDelete, setIsDelete] = useState(false);

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
      const newSupabaseImages = [...supabaseImages];
      newSupabaseImages.splice(index, 1);
      // const deletedImage = newSupabaseImages.splice(index, 1)[0];
      // setIsDelete(true);
      setSupabaseImages(newSupabaseImages);
      // await deletImageFromStorage(deletedImage);
      // setIsDelete(false);
    } else {
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
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

  // const deletImageFromStorage = async (image: string) => {

  //   const data = localStorage.getItem("supabaseSession");
  //   const session = data ? JSON.parse(data) : null;

  //   const filePath = image.split("/").pop();
  //   if (!filePath) {
  //     console.error("Invalid file path");
  //     return;
  //   }
  //   try {
  //     const { error } = await getSupabaseClient(session.access_token)
  //       .storage.from("images")
  //       .remove([filePath]);

  //     if (error) {
  //       console.error("Error deleting image from Supabase storage:", error);
  //       alert("Error Deleting image");
  //       setSupabaseImages([...supabaseImages]); // Restore the original array
  //       return;
  //     }
  //     alert("Image deleted Successfully");
  //   } catch (error) {
  //     console.error("Error deleting image from Supabase storage:", error);
  //     setSupabaseImages([...supabaseImages]); // Restore the original array
  //   }
  // };

  // Upload images to Supabase storage
  const uploadImagesToSupabase = async (images: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const data = localStorage.getItem("supabaseSession");
    const session = data ? JSON.parse(data) : null;
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
      {/* {isDelete ? (
        <Spinner />
      ) : (
        <div> */}
      <ImagePreviewer
        supabaseImages={supabaseImages}
        uploadedImages={uploadedImages}
        onDelete={handleDelete}
      />
      <ImageUploader onUpload={handleUpload} />
      <Button onClick={handleSave}>
        {isUpload ? <Spinner name={"Updating..."} /> : "Save Images"}
      </Button>
      {/* </div>
      )} */}
    </div>
  );
};

export default BannerImages;
