"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { Star, Heart, Plus, Check } from "lucide-react";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const [wishList, setWishList] = useState(false);
  const [cart, setCart] = useState(false);
  return (
    <Card
      className="bg-white rounded-lg shadow-md p-2 snap-center cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="flex justify-between items-center">
        <div>
          <Star className="bg-red-500" />
          <span>4.3</span>
        </div>
        <Heart
          onClick={() => setWishList(!wishList)}
          className={`${wishList ? "bg-red" : "bg-primary"}  `}
        />
      </div>
      <Image
        src={product?.photos.photos[2]}
        width={230}
        height={230}
        alt={product?.name}
      />
      <CardContent>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="flex justify-between items-center mb-4 mt-4">
          <div className="flex-col gap-2">
            <span className="text-lg"> ₹{product.offerPrice}</span>
            <span className="text-sm">₹{product.price}</span>
          </div>
          <button onClick={() => setCart(!cart)}>
            {cart ? <Plus /> : <Check />}
          </button>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
