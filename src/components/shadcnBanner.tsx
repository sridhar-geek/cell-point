"use client";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function CarouselBanner({ imageLinks }: { imageLinks: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false })); // Fix: Autoplay continues after interaction

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    };
  }, [api]);

  const handleMouseEnter = () => plugin.current.stop();
  const handleMouseLeave = () => plugin.current.reset();

  return (
    <div className="w-full px-4 md:px-0">
      <div className="w-full relative">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full h-auto mx-auto my-auto flex justify-between items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          opts={{
            align: "center", 
            loop: true,
          }}
        >
          <CarouselContent className="w-full">
            {imageLinks.map((image, index) => (
              <CarouselItem key={index} className="w-full">
                <div className="w-full flex justify-center">
                  <Image
                    src={image}
                    width={930}
                    height={400}
                    alt={image}
                    className="object-contain w-full h-auto max-h-[230px] md:max-h-[400px]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1" />
          <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-1" />
        </Carousel>
      </div>
      <div className="py-4 md:py-6 flex justify-center items-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              current === index ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default CarouselBanner;
