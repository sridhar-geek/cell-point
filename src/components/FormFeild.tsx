"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, ControllerRenderProps, Path } from "react-hook-form";

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  label: string;
  name: Path<T>;
  type: string;
  placeholder: string;
  showPassword?: boolean;
  setShowPassword?: Dispatch<SetStateAction<boolean>>;
}

const RenderInput = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T>;
  props: CustomProps<T>;
}) => {
  switch (props.type) {
    case "password":
      return (
        <FormControl>
          <div className="relative">
            <Input
              type={props.showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...field}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() =>
                props.setShowPassword &&
                props.setShowPassword(!props.showPassword)
              }
            >
              {props.showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </FormControl>
      );
    default:
      return (
        <FormControl>
          <Input
            placeholder={props.placeholder}
            {...field}
            type={props.type}
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value ?? ""}
          />
        </FormControl>
      );
  }
};

const FormFeild = <T extends FieldValues>(props: CustomProps<T>) => {
  const { control, label, name } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFeild;
