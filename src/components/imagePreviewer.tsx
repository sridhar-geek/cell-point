"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";

type ImagePreviewerProps = {
  supabaseImages: string[];
  uploadedImages: File[];
  onDelete: (index: number, isSupabaseImage: boolean) => void;
};

const ImagePreviewer = ({
  supabaseImages,
  uploadedImages,
  onDelete,
}: ImagePreviewerProps) => {
  
  const imageLinks = [
    ...supabaseImages,
    ...uploadedImages.map((image) => URL.createObjectURL(image)),
  ];

  const handleDelete = (image: string, index: number) => {
    if (image.includes("tieigchmmwhwonipivot")) onDelete(index, true);
    else onDelete(index, false);
  };
  return (
    <div className="w-full px-4 md:px-0 py-4 md:py-6 ">
      <div className="w-full relative">
        <Carousel
          className="w-full h-auto mx-auto my-auto flex justify-between items-center"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="w-full">
            {imageLinks.length === 0 ? (
              <span className="text-center w-full align-middle font-bold">
                No Images found, Add few images to view the Preview
              </span>
            ) : (
              imageLinks.map((image, index) => (
                <CarouselItem key={index} className="w-full">
                  <div className="w-full flex justify-center relative">
                    <Image
                      src={image}
                      width={930}
                      height={400}
                      alt={`image-${index}`}
                      className="object-contain w-full h-auto max-h-[230px] md:max-h-[400px]"
                    />
                    <button
                      onClick={() => handleDelete(image, index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1" />
          <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1" />
        </Carousel>
      </div>
    </div>
  );
};

export default ImagePreviewer;
