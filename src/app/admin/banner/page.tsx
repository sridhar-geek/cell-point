"use client";
import { useEffect, useState } from "react";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { bannerImagesProp } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import BannerImages from "@/components/Image Uploads/wholeImageComponent";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { errorMsg } from "@/lib/common";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/Skeleton/spinner";
import { useRouter } from "next/navigation";

const UpdateBannerImages = () => {
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [isImagesUpdating, setIsImagesUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data, isLoading, error } = usePersistentSWR<bannerImagesProp>(
    "bannerImages",
    "/api/supabase/common"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Initialize supabaseImages with data from API
  useEffect(() => {
    if (data && data?.bannerImages?.photos) {
      setSupabaseImages(data.bannerImages.photos);
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
    const id = data && data.id;
    const localstorageData = localStorage.getItem("supabaseSession");
    const session = localstorageData ? JSON.parse(localstorageData) : null;
    setIsImagesUpdating(true);
    //  sending patch request to update the common table
    try {
      const response = await fetch(`/api/supabase/common/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalImages),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Revalidate the data to ensure it's up-to-date
      mutate("bannerImages");
      setIsImagesUpdating(false);
      toast({
        title: "Banner Images Updated",
        description: "Images updated Successfully",
      });
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || (error as Error).message;

      setIsImagesUpdating(false);
      toast({
        title: "Error occoured in updating Images",
        description: errorMessage || "falied to update",
        variant : "destructive"
      });
      return errorMsg(error);
    }
  };

  return (
    <div>
      <BannerImages supabaseStorage={supabaseImages} onSave={setFinalImages} />

      <Button
        onClick={saveImagesToDatabase}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        disabled={finalImages.length === 0}
      >
        {isImagesUpdating ? <Spinner name={"Updating..."}/> : "Conform"}
      </Button>
    </div>
  );
};

export default UpdateBannerImages;
