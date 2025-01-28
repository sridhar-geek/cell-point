"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormFeild from "@/components/formFeild";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/spinner";
import { useTransition } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Zod form Schema
const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Creating form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form Feilds
  const inputFormFeilds = [
    {
      name: "email",
      label: "Email ",
      type: "text",
      placeholder: "email@gmail.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your Password",
    },
  ];

  // Handler function -->
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const email = values.email;
    const password = values.password;

    startTransition(async () => {
      try {
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log("this is response", response);
        if (response.data.user) {
          // Successful login
          toast({
            title: "Login Successful",
            description: `Welcome User`,
            variant: "default",
          });
          router.push("/admin/dashboard");
        } else {
          // Login failed
          toast({
            title: "Login Failed",
            description: response.error?.message || "Invalid login credentials",
            variant: "destructive",
          });
        }
      } catch (error: unknown) {
        // Handle unexpected errors
        const errorMessage =
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || (error as Error).message;

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {/* Card to hold login form */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* Login Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {inputFormFeilds.map((inputFeild) => (
                <FormFeild
                  key={inputFeild.label}
                  control={form.control}
                  name={inputFeild.name as "email" | "password"}
                  label={inputFeild.label}
                  placeholder={inputFeild.placeholder}
                  type={inputFeild.type}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              ))}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Spinner /> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
