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
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { useState } from "react";
import FormFeild from "./formFeild";

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
  const [isOpen, setIsOpen] = useState(false);

  // Zod form Schema
  const formSchema = z.object({
    name: z.string().min(4).max(50),
    priority: z.boolean().default(false),
  });

  // Creating form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      priority,
    },
  });

  // Form Feilds
  const inputFormFeilds = [
    {
      name: "name",
      label: "CatgoryName ",
      type: "text",
      placeholder: "category name",
    },
    {
      name: "priority",
      label: "Priority",
      type: "checkbox",
      placeholder: "priority"
    },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    // const { data, error, isLoading, mutate } = usePersistentSWR(
    //   `editCategory${id}`,
    //   `/api/supabase/category/${id}`
    // );
    try {
      console.log(values);
      setIsOpen(false)
      onClose();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-md">
        <DialogHeader onClick={(event) => event.stopPropagation()}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {add
              ? "Create New Category."
              : `Your about to change the category Name of the ${name}.`}
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
