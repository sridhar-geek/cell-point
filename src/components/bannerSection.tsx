"use client";
import React, { useEffect, useState } from "react";
import CarouselBanner from "./shadcnBanner";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { bannerImagesProp } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

const BannerSection = () => {
  const { data, isLoading, error } = usePersistentSWR<bannerImagesProp[]>(
    "bannerImages",
    "/api/supabase/common?column=bannerImages"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
    );
  }
  if (error) {
    return <div>Error fetching in Images</div>;
  }

  return (
    <div>
      {isLoading ? (
        <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
      ) : (
        data && (
          <CarouselBanner imageLinks={data[0].bannerImages.photos || []} />
        )
      )}
    </div>
  );
};

export default BannerSection;
