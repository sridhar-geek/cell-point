"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { Star, Heart, CircleDot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type productCardProps = {
  product: {
    available: boolean;
    categoryName: string;
    created_at: string;
    description: string;
    id: string;
    name: string;
    offerPrice: number;
    photos: {
      photos: string[];
    };
    price: number;
    updated_at: string;
  };
};

const ProductCard = ({ product }: productCardProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [wishList, setWishList] = useState(false);

  const handleWishList = (event: React.MouseEvent) => {
    event.stopPropagation();
    setWishList(!wishList);
    if (wishList) {
      toast({
        title: "Removed from wishlist",
        description: `${product.name} is removed from your wishlist`,
      });
    } else {
      toast({
        title: "Added to wishlist",
        description: `${product.name} is added to your wishlist`,
      });
    }
  };

  return (
    <Card
      className="bg-white rounded-lg shadow-md p-2 snap-center cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <Star className="" fill="red" />
          <span>4.3</span>
        </div>
        <Heart
          onClick={(event) => handleWishList(event)}
          fill={`${wishList ? "red" : "white"}`}
        />
      </div>
      <Image
        src={product?.photos.photos[2]}
        width={230}
        height={430}
        alt={product?.name}
      />
      <CardContent className="mt-3">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="flex justify-between items-center mb-4 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm line-through">₹{product.price}</span>
            <span className="text-lg"> ₹{product.offerPrice}</span>
          </div>
          <CircleDot
            fill={`${product.available ? "green" : "red"}`}
            size={"20px"}
          />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
