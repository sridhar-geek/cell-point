"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { mutate } from "swr";
import { errorMsg } from "@/lib/common";
import Spinner from "./spinner";
// import { productsProp } from "@/lib/types";

type DeleteDialogProps = {
  id: string;
  productName?: string;
  categoryName: string;
  product: boolean;
  onClose: () => void;
};

const DeleteDialog = ({
  id,
  productName,
  categoryName,
  product,
  onClose,
}: DeleteDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const data = localStorage.getItem("supabaseSession");
  const session = data ? JSON.parse(data) : null;

  // based on the product, change the url and swr key
  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLoading(true);
    try {
      const url = product
        ? `/api/supabase/product/${id}`
        : `/api/supabase/category/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Show success toast
      toast({
        title: product
          ? `${productName} is deleted`
          : `${categoryName} is deleted`,
        description: product
          ? `${productName} has been deleted successfully.`
          : `${categoryName} has been deleted successfully.`,
      });

      // Optimistically update the SWR cache
      // mutate(
      //   "allProducts", // SWR key for the products data
      //   async (currentData: productsProp[]) => {
      //     // Filter out the deleted product from the current data
      //     return currentData.filter(
      //       (product: productsProp) => product.id !== id
      //     );
      //   },
      //   false // Do not revalidate immediately (optimistic update)
      // );

      // Revalidate the data to ensure it's up-to-date
      mutate(product ? "allProducts" : "allcategories");

      setIsLoading(false);
      // Close dialog after deletion
      setIsOpen(false);
      onClose();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: `An error occurred while deleting the ${
          product ? productName : categoryName
        } .`,
        variant: "destructive",
      });
      setIsLoading(false);
      // Close dialog after deletion
      setIsOpen(false);
      onClose();
      return errorMsg(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Trash2
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(true);
          }}
          className="cursor-pointer text-white"
          fill="red"
        />
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px] bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-red-700">
            Delete Confirmation
          </DialogTitle>
          <DialogDescription>
            {product ? (
              <div>
                Are you sure you want to delete{" "}
                <span className="text-blue-700">{productName}</span> from{" "}
                <span className="text-blue-800">{categoryName}</span>?
              </div>
            ) : (
              <div>
                Deleting <span className="text-blue-700">{categoryName}</span>{" "}
                will delete all linked products. Are you sure to delete?
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Button>
            <Spinner />
          </Button>
        ) : (
          <div className="w-full flex justify-around items-center">
            <Button
              className="bg-red-600 hover:bg-red-900"
              onClick={handleDelete}
            >
              Yes
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-900"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(false);
                onClose();
              }}
            >
              No
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
