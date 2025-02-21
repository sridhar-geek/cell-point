"use client";
import { useEffect, useState } from "react";
import ImageUploader from "@/components/imageUpload";
import ImagePreviewer from "@/components/imagePreviewer";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { bannerImagesProp } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";

const BannerImages = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]); // Track Supabase images
  const { data, isLoading, error } = usePersistentSWR<bannerImagesProp[]>(
    "bannerImages",
    "/api/supabase/common?column=bannerImages"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Initialize supabaseImages with data from API
  useEffect(() => {
    if (data && data[0]?.bannerImages?.photos) {
      setSupabaseImages(data[0].bannerImages.photos);
    }
  }, [data]);

  if (!hydrated || isLoading) {
    return (
      <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
    );
  }

  if (error) {
    return <div>Error fetching Images</div>;
  }

  // Handle image upload
  const handleUpload = (images: File[]) => {
    setUploadedImages(images);
  };

  // Handle image delete
  const handleDelete = (index: number, isSupabaseImage: boolean) => {
    if (isSupabaseImage) {
      // Delete from supabaseImages
      const newSupabaseImages = [...supabaseImages];
      newSupabaseImages.splice(index, 1);
      setSupabaseImages(newSupabaseImages);
    } else {
      // Delete from uploadedImages
      const newUploadedImages = [...uploadedImages];
      newUploadedImages.splice(index, 1);
      setUploadedImages(newUploadedImages);
    }
  };

  // Handle saving images
  const handleSave = async () => {
    try {
      // Upload new images to Supabase storage
      const uploadedImageUrls = await uploadImagesToSupabase(uploadedImages);

      // Combine remaining Supabase images with newly uploaded images
      const updatedImages = [...supabaseImages, ...uploadedImageUrls];
      console.log("updatedImages", updatedImages);

      // Save the updated images back to the database
      // await saveImagesToDatabase(updatedImages);

      alert("Images saved successfully!");
    } catch (error) {
      console.error("Error saving images:", error);
      alert("Failed to save images.");
    }
  };

  // Upload images to Supabase storage
  const uploadImagesToSupabase = async (images: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      const filePath = `banner-images/${Date.now()}-${image.name}`;
      const { error } = await supabase.storage
        .from("images bucket")
        .upload(filePath, image);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const publicUrl = await supabase.storage
        .from("images bucket")
        .getPublicUrl(filePath).data.publicUrl;

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  // Save images to the database
  // const saveImagesToDatabase = async (images: string[]) => {
  //   const { error } = await supabase
  //     .from("your_table_name") // Replace with your table name
  //     .update({ bannerImages: { photos: images } })
  //     .eq("id", data?.[0]?.id); // Replace with your primary key logic
  //   if (error) {
  //     throw new Error(error.message);
  //   }
  // };

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
