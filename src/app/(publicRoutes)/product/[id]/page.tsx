"use client";
import CarouselBanner from "@/components/shadcnBanner";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Share2, Star } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { phoneNumber } from "@/lib/data";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { Skeleton } from "@/components/ui/skeleton";
import { productsProp } from "@/lib/types";
// import { product } from "@/lib/data";

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

  if (!hydrated || isLoading) {
    return (
      <div className="flex-col">
        <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
        <div className="space-y-2 mt-10">
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
    <div className="min-h-screen py-6">
      <ArrowLeft
        onClick={() => router.back()}
        className="cursor-pointer m-6 text-gray-700 hover:text-gray-900"
        size={44}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {product ? (
          <>
            {/* Image Carousel */}
            <div className="mb-8">
              <CarouselBanner imageLinks={product[0].photos?.photos || []} />
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Product Details */}
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product[0].name}
                  </h1>
                  <h3 className="text-sm text-gray-500 mt-2">
                    {product[0].categoryName}
                  </h3>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Price:
                  </h2>
                  <div className="text-lg text-gray-500 line-through">
                    ₹{product[0].price}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{product[0].offerPrice}
                  </div>
                </div>

                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.5)</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Description
                  </h2>
                  <p className="text-gray-600 indent-4">
                    {product[0].description}
                  </p>
                </div>
              </div>

              {/* Right Column: Buttons */}
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={handleShare}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Share <Share2 className="ml-2" />
                </Button>
                <Button
                  onClick={handleBuy}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-700">
            No product data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsInfo;
