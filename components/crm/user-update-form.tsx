"use client";
import {
  FormData,
  updateDashboardSettings,
} from "@/actions/update-dashboard-settings";
import { UpdateUserInput, updateUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Icons } from "../globals/icons";
import { useSession } from "next-auth/react";
import { Textarea } from "../ui/textarea";

interface UserUpdateFormProps {
  user: Pick<
    User,
    | "id"
    | "agentName"
    | "agentEmail"
    | "address"
    | "bio"
    | "postalCode"
    | "whatsappNumber"
    | "officeLine"
  >;
}

export default function UserUpdateForm({ user }: UserUpdateFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateDashboardSettings.bind(null, user.id);

  const session = useSession();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      agentName: user?.agentName || "",
      agentEmail: user?.agentEmail || "",
      address: user?.address || "",
      bio: user?.bio || "",
      postalCode: user?.postalCode || "",
      whatsappNumber: user?.whatsappNumber || "",
      officeLine: user?.officeLine || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast.error("Error while updating profile information");
      } else {
        toast.success("Your profile information  has been updated!");
        session.update();
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Your Agency Information</CardTitle>
          <CardDescription>Please enter your agent information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 grid grid-cols-1 lg:grid-cols-2">
          <div className="grid gap-1">
            <Label className="" htmlFor="agentName">
              Agent Name
            </Label>
            <Input
              id="agentName"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("agentName")}
            />
            {errors.agentName && (
              <p className="px-1 text-xs text-red-500">
                {errors.agentName.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="" htmlFor="agentName">
              Agent Email
            </Label>
            <Input
              id="agentEmail"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("agentEmail")}
            />
            {errors.agentEmail && (
              <p className="px-1 text-xs text-red-500">
                {errors.agentEmail.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="" htmlFor="officeLine">
              Office Line
            </Label>
            <Input
              id="officeLine"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("officeLine")}
            />
            {errors.officeLine && (
              <p className="px-1 text-xs text-red-500">
                {errors.officeLine.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="" htmlFor="whatsappNumber">
              Whatsapp Number
            </Label>
            <Input
              id="whatsappNumber"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("whatsappNumber")}
            />
            {errors.whatsappNumber && (
              <p className="px-1 text-xs text-red-500">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="" htmlFor="address">
              Office Address
            </Label>
            <Input
              id="address"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("address")}
            />
            {errors.address && (
              <p className="px-1 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="" htmlFor="postalCode">
              Postal Code
            </Label>
            <Input
              id="postalCode"
              className="w-full mt-2 sm:w-[400px]"
              size={32}
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="px-1 text-xs text-red-500">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <Label className="" htmlFor="bio">
              Bio
            </Label>
            <Textarea
              id="bio"
              className="w-full mt-2 sm:w-[400px]"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="px-1 text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            className={cn(buttonVariants())}
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>{isPending ? "Saving" : "Save"}</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
