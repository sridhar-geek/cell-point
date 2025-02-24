"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useState } from "react";
import FormFeild from "../formFeild";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";
import { errorMsg } from "@/lib/common";
import Spinner from "../Skeleton/spinner";

// Zod form Schema
const formSchema = z.object({
  name: z.string().min(4).max(50),
  priority: z.boolean().default(false),
});

// Form Feilds
const inputFormFeilds = [
  {
    name: "name",
    label: "Category Name",
    type: "text",
    placeholder: "category name",
  },
  {
    name: "priority",
    label: "Priority",
    type: "checkbox",
    placeholder: "priority",
  },
];

const EditDialog = ({
  open,
  id,
  title,
  add,
  name,
  priority,
  onClose,
}: {
  open: boolean;
  title: string;
  add: boolean;
  id?: string;
  name: string;
  priority: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Creating form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      priority,
    },
  });

  const data = localStorage.getItem("supabaseSession");
  const session = data ? JSON.parse(data) : null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // send api request based on the add or patch
    try {
      const url = add
        ? "/api/supabase/category"
        : `/api/supabase/category/${id}`;
      const method = add ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Revalidate the data to ensure it's up-to-date
      mutate("allCategories");
      setIsLoading(false);
      onClose();
      // Show success toast
      toast({
        title: add ? "Category added" : "Category Modified",
        description: add
          ? `New Category added to your list`
          : ` Category ${name} is modified Sucessfully`,
      });
    } catch (error: unknown) {
      setIsLoading(false);
      onClose();
      toast({
        title: add ? "Failed to Add " : `Failed to modify ${name} Category`,
        description: add
          ? `Failed to add new  Category to your list`
          : ` Failed to modify Category ${name} try again`,
      });
      return errorMsg(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] sm:max-w-[420px] bg-white rounded-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {add
              ? "Create New Category."
              : `You're about to change the category name of ${name}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {inputFormFeilds.map((inputFeild) => (
              <FormFeild
                key={inputFeild.label}
                control={form.control}
                name={inputFeild.name as "name" | "priority"}
                label={inputFeild.label}
                placeholder={inputFeild.placeholder}
                type={inputFeild.type}
              />
            ))}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Spinner name={add ? "Adding..." : "Updating..."} />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
