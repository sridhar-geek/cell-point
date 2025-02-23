"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/imageUpload";
import ImagePreviewer from "@/components/imagePreviewer";
import { getSupabaseClient, supabase } from "@/lib/supabaseClient";

type BannerImagesProp = {
  supabaseStorage: string[];
  onSave: (images: string[]) => void;
};

const BannerImages = ({ supabaseStorage, onSave }: BannerImagesProp) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);

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
  const handleDelete = (index: number, isSupabaseImage: boolean) => {
    if (isSupabaseImage) {
      const newSupabaseImages = [...supabaseImages];
      newSupabaseImages.splice(index, 1);
      setSupabaseImages(newSupabaseImages);
    } else {
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
    }
  };

  // Handle saving images
  const handleSave = async () => {
    try {
      const uploadedImageUrls = await uploadImagesToSupabase(uploadedImages);
      const updatedImages = [...supabaseImages, ...uploadedImageUrls];

      console.log("Updated images before saving:", updatedImages);
      onSave(updatedImages); // Only update final images on save

      alert("Images saved successfully!");
    } catch (error) {
      console.error("Error saving images:", error);
      alert("Failed to save images.");
    }
  };

  // Upload images to Supabase storage
  const uploadImagesToSupabase = async (images: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const data = localStorage.getItem("supabaseSession");
    const session = data ? JSON.parse(data) : null;
  ][[]]
    for (const image of images) {
      const filePath = `banner-images/${Date.now()}-${image.name}`;
      const { error } = await getSupabaseClient(session.access_token)
        .storage.from("images")
        .upload(filePath, image);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  return (
    <div>
      <ImagePreviewer
        supabaseImages={supabaseImages}
        uploadedImages={uploadedImages}
        onDelete={handleDelete}
      />
      <ImageUploader onUpload={handleUpload} />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save Images
      </button>
    </div>
  );
};

export default BannerImages;
