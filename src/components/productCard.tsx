"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { Star, Heart, CircleDot, FilePenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteDialog from "./DeleteDialog";
import { productCardProp } from "@/lib/types";

const ProductCard = ({ product, admin }: productCardProp) => {
  const { toast } = useToast();
  const router = useRouter();
  const [wishList, setWishList] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Generate a random rating between 4.0 and 5.0
  const randomRating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

  //  Show notification on add and remove from wishlist
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

  const handleEdit = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    router.push(`/admin/editProduct/${id}`);
  };

  return (
    <Card
      className="bg-white rounded-lg shadow-md p-2 snap-center cursor-pointer transition-transform duration-300 hover:scale-105 w-64 flex-shrink-0"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Based on user show rating and action buttons */}
      {admin ? (
        <div className="flex justify-between items-center mb-3">
          {" "}
          {/* Edit button and delete button */}
          <div
            className="flex gap-2 items-center"
            onClick={(event) => handleEdit(event, product.id)}
          >
            <FilePenLine className="text-white" fill="blue" />
            <span className="text-sm font-semibold">Edit</span>{" "}
          </div>
          {/* Delete dialog */}
          <DeleteDialog
            id={product.id}
            productName={product.name}
            categoryName={product.categoryName}
            product={true}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
        </div>
      ) : (
        <div className="flex justify-between items-center mb-3">
          {/* Rating and wishlist */}
          <div className="flex gap-2 items-center">
            <Star className="text-yellow-400" fill="yellow" />
            {/* Display random rating */}
            <span className="text-sm font-semibold">{randomRating}</span>{" "}
          </div>
          <Heart
            onClick={(event) => handleWishList(event)}
            className={`cursor-pointer ${
              wishList ? "text-red-500" : "text-gray-500"
            }`}
            fill={`${wishList ? "red" : "white"}`}
          />
        </div>
      )}
      {/* product image */}
      <div className="relative w-full h-20 overflow-hidden rounded-lg">
        <Image
          src={product?.photos.photos[0]}
          alt={product?.name}
          layout="fill"
          objectFit="contain"
          className="rounded-lg h-full"
        />
      </div>
      {/* description and price */}
      <CardContent className="mt-3 space-y-2">
        <CardTitle className="text-lg font-semibold truncate">
          {product.name}
        </CardTitle>{" "}
        {/* Truncate long names */}
        <CardDescription className="flex-col gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-black font-semibold">Price:</p>
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price}
            </span>
            <span className="text-lg font-bold text-green-600">
              ₹{product.offerPrice}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CircleDot
              fill={`${product.available ? "green" : "red"}`}
              size={"16px"}
            />
            <span className="text-sm text-gray-500">
              {product.available ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
