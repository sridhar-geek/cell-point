"use client";
import ProductCard from "@/components/productCard";
// import { products } from "@/lib/data";
// import { categories } from "@/lib/data";
import { PencilLine, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { CardSkeleton } from "@/components/skeleton";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { categoryProp, productsProp } from "@/lib/types";
import { Button } from "@/components/ui/button";

const Categories = () => {
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<categoryProp | null>(
    null
  );
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setHydrated(true);
  }, []);

  const {
    data: categories,
    isLoading,
    error,
  } = usePersistentSWR<categoryProp[]>(
    "allcategories",
    "/api/supabase/category"
  );

  const {
    data: products,
    isLoading: productsLoading,
    error: productError,
  } = usePersistentSWR<productsProp[]>("allProducts", "/api/supabase/product");
  // Initialize visibleCategories when categories are loaded
  useEffect(() => {
    if (categories) {
      const initialVisibility = categories.reduce((acc, category) => {
        acc[category.id] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setVisibleCategories(initialVisibility);
    }
  }, [categories]);

  if (!hydrated || isLoading || productsLoading) {
    return (
      <div>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index}>
            <h3 className="text-2xl font-bold m-2">
              Categories Loading <span className="animate-bounce">....</span>
            </h3>
            <CardSkeleton className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " />
          </div>
        ))}
      </div>
    );
  }
  const toggleCategoryVisibility = (categoryId: string) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  //  Gives error Message
  if (error || productError) {
    // Give Proper Error Message
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occoured while getting Products.....
      </div>
    );
  }

  return (
    <div className="mt-10 mb-10">
      <div className="flex justify-end items-center">
        <Button className="font-semibold" onClick={() => setIsAddDialog(true)}>
          ➕ Add New Category
        </Button>
      </div>
      <EditDialog
        add={true}
        name=""
        onClose={() => setIsAddDialog(false)}
        priority={false}
        open={isAddDialog}
        title="Add Category"
      />
      {categories &&
        categories.map((category) => (
          <div key={category.id} className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h3 className="text-2xl font-bold m-2">{category.name}</h3>
                <button
                  onClick={() => setSelectedCategory(category)} // Set the selected category
                  className="text-blue-600"
                >
                  <PencilLine />
                </button>
              </div>
              <div className="flex items-center gap-7">
                {/* Delete dialog */}
                <DeleteDialog
                  id={category.id}
                  categoryName={category.name}
                  product={false}
                  onClose={() => setIsDeleteDialogOpen(false)}
                />
                <button
                  onClick={() => toggleCategoryVisibility(category.id)}
                  className="transition-transform duration-300 ease-in-out"
                  style={{
                    transform: visibleCategories[category.id]
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                  }}
                >
                  <ChevronUp />
                </button>
              </div>
            </div>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                height: visibleCategories[category.id] ? "auto" : "0",
                opacity: visibleCategories[category.id] ? 1 : 0,
              }}
            >
              <div className="flex flex-wrap gap-4 justify-center items-center m-4">
                {products &&
                  products
                    .filter((product) => product.categoryName === category.name)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        admin={true}
                        product={product}
                      />
                    ))}
              </div>
            </div>
          </div>
        ))}
      {selectedCategory && (
        <EditDialog
          add={false}
          id={selectedCategory.id}
          name={selectedCategory.name}
          onClose={() => setSelectedCategory(null)} // Reset selected category on close
          priority={selectedCategory.priority}
          open={!!selectedCategory}
          title="Edit Category"
        />
      )}
    </div>
  );
};

export default Categories;
