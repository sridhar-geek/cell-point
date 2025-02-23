"use client";
import { useEffect, useState } from "react";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { bannerImagesProp } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import BannerImages from "@/components/wholeImageComponent";
import { Button } from "@/components/ui/button";

const UpdateBannerImages = () => {
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [finalImages, setFinalImages] = useState<string[]>([]);

  const { data, isLoading, error } = usePersistentSWR<bannerImagesProp[]>(
    "bannerImages",
    "/api/supabase/common?column=bannerImages"
    // "supabaseeImages",
    // "/api/supabase/imagebucket"
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

  // Save images to the database
  const saveImagesToDatabase = async () => {
    console.log("Saving images:", finalImages);
   
    // const { error } = await supabase
    //   .from("your_table_name") // Replace with your table name
    //   .update({ bannerImages: { photos: finalImages } })
    //   .eq("id", data?.[0]?.id); // Replace with your primary key logic
    // if (error) {
    //   throw new Error(error.message);
    // }

    alert("Images updated successfully!");
  };

  return (
    <div>
      <BannerImages
        supabaseStorage={supabaseImages}
        onSave={setFinalImages} 
      />

      <Button
        onClick={saveImagesToDatabase}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        disabled= {finalImages.length === 0}
      >
        Confirm
      </Button>
    </div>
  );
};

export default UpdateBannerImages;
