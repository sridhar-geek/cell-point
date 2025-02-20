"use client";
import { productsProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { Search } from "lucide-react";
import ProductCard from "@/components/productCard";
import { CardSkeleton } from "@/components/skeleton";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// import { products } from "@/lib/data";

const Products = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredproducts, setFiltersProducts] = useState<productsProp[]>([]);

  const { data, isLoading, error } = usePersistentSWR<productsProp[]>(
    "allProducts",
    "/api/supabase/product"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    let allProducts;
    if (data) allProducts = [...data];
    else return;

    if (searchTerm)
      allProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFiltersProducts(allProducts);
  }, [searchTerm, data]);

  // Show Loading screen
  if (!hydrated || isLoading) {
    return (
      <CardSkeleton className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " />
    );
  }

  //  Gives error Message
  if (error) {
    // Give Proper Error Message
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occoured while getting New Lanches.....
      </div>
    );
  }

  return (
    <div>
      {/* Search and add product button */}
      <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-9">
        {/* Search box */}
        <div className="relative w-full md:w-1/3 rounded-sm focus:ring-0 focus:ring-offset-0 outline-none focus:outline-none bg-card ">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search className=" h-4 w-6 text-muted-foreground" />
          </span>
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a Product....."
            className="p-6 pl-16  rounded-sm focus:ring-0 focus:ring-offset-0 outline-none focus:outline-none bg-card"
          />
        </div>{" "}
        {/* Product button */}
        <Button
          className="font-semibold"
          onClick={() => router.push("/admin/addProduct")}
        >
          ➕ Add New Product
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        {data &&
          (filteredproducts.length === 0 ? (
            <div className="flex justify-center items-center max-h-full">
              {/* No Products jsx */}
              <p className="font-semibold"> 😟No products found</p>
            </div>
          ) : (
            filteredproducts.map((product) => (
              <ProductCard key={product.id} product={product} admin={true} />
            ))
          ))}
      </div>
    </div>
  );
};

export default Products;
