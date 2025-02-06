"use client";
import CarouselBanner from "@/components/shadcnBanner";
import { productsProp } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { phoneNumber } from "@/lib/data";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsInfo = () => {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const { id } = params as { id: string };
  const [url, setUrl] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = usePersistentSWR<productsProp[]>(
    `singleProduct/${id}`,
    `/api/supabase/product/${id}`
  );

  useEffect(() => {
    setHydrated(true);
    setUrl(window.location.href);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex-col">
        <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
        <div className="space-y-2">
          <Skeleton className="h-2 md:h-4 w-[125px] md:w-[250px]" />
          <Skeleton className="h-2 md:h-4 w-[90px] md:w-[200px]" />
          <Skeleton className="h-2 md:h-4 w-[90px] md:w-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    // Give Proper Error Message
    return (
      <div className="text-red-800">
        Error Occoured while getting New Lanches.....
      </div>
    );
  }

  const handleShare = async () => {
    try {
      // Check if the Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: `Check out this cool ${
            product ? product[0].name : "Amazing gadget"
          } from Divya Cell Point `,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: `Check out this cool ${
            product ? product[0].name : "Amazing gadget"
          }  from Divya Cell Point `,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error",
        description: "Failed to share the link.",
        variant: "destructive",
      });
    }
  };

  const handleBuy = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Copy the WhatsApp URL to the clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "WhatsApp link has been copied to your clipboard.",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        toast({
          title: "Error",
          description: "Failed to copy the WhatsApp link.",
          variant: "destructive",
        });
      });
  };
  return (
    <div>
      {isLoading ? (
        <div className="flex-col">
          <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
          <div className="space-y-2">
            <Skeleton className="h-2 md:h-4 w-[125px] md:w-[250px]" />
            <Skeleton className="h-2 md:h-4 w-[90px] md:w-[200px]" />
            <Skeleton className="h-2 md:h-4 w-[90px] md:w-[200px]" />
          </div>
        </div>
      ) : (
        <div>
          {product ? (
            <>
              <ArrowLeft
                onClick={() => {
                  router.back();
                }}
                className="cursor-pointer m-6"
                size={"44px"}
              />
              <CarouselBanner imageLinks={product[0].photos?.photos || []} />
              <div className="mx-3 md:mx-8 lg:mx-10 flex-col gap-20">
                <div className="flex-col justify-center items-center text-center">
                  <h1 className="text-xl ">{product[0].name}</h1>
                  <h3 className="text-xs">{product[0].categoryName}</h3>
                </div>
                <div className="flex  items-center">
                  <h2 className="text-xl p-2 ">Price: </h2>
                  <div className="line-through pr-3">₹ {product[0].price}</div>
                  <div>₹ {product[0].offerPrice}</div>
                </div>
                <div>
                  <h2>Ratings : </h2>
                </div>
                <span className="text-xl">Description</span>
                <div className="indent-4">{product[0].description}</div>
              </div>
              <div className="w-full mt-10">
                <Button className="w-1/2" onClick={handleShare}>
                  Share <Share2 />
                </Button>
                <Button className="w-1/2" onClick={handleBuy}>
                  Buy
                </Button>
              </div>
            </>
          ) : (
            <span>No product data available</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsInfo;
