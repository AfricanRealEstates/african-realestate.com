"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { updateUserById } from "@/actions/users";

const FormSchema = z.object({
  token: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerifyTokenForm({
  userToken,
  id,
}: {
  userToken: number | undefined;
  id: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const userInputToken = parseInt(data.token);
    if (userInputToken === userToken) {
      setShowNotification(false);
      //Update User
      try {
        await updateUserById(id);
        setLoading(false);
        // reset();
        toast.success("Account Verified");
        router.push("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setShowNotification(true);
      setLoading(false);
    }
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {showNotification && (
          <div
            className="p-4 mb-4 text-sm rounded-lg bg-red-50  text-red-400"
            role="alert"
          >
            <span className="font-medium">Wrong Token!</span> Change a few
            things up and try submitting again.
          </div>
        )}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-auto my-5 max-w-md text-sm sm:text-base lg:mb-8 text-gray-400">
                Enter Token Here
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the 6-figure pass code sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          disabled={loading}
          className="mt-4 inline-block w-full cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-6 py-3 text-center font-semibold text-white"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Please wait...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </Form>
  );
}
