"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { type LoginUserInput, loginUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Icons } from "../globals/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { checkUserStatus } from "./auth-actions";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  // Use useEffect instead of useState for side effects
  useEffect(() => {
    if (error) {
      // Handle specific error codes if needed
      if (error === "OAuthAccountNotLinked") {
        toast.error("Email already in use with a different provider");
      } else {
        toast.error(decodeURIComponent(error));
      }
    }
  }, [error]);

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginUserInput) => {
    try {
      setIsLoading(true);

      // First check if the user is active before completing sign-in
      const userStatus = await checkUserStatus(values.email);

      if (userStatus.exists && !userStatus.isActive) {
        if (userStatus.suspensionEndDate) {
          const endDate = new Date(userStatus.suspensionEndDate);
          toast.error(
            `Your account is suspended until ${endDate.toLocaleDateString()}.`
          );
        } else {
          toast.error(
            "Your account has been blocked. Please contact support for assistance."
          );
        }
        setIsLoading(false);
        return; // Stop the login process here
      }

      // Proceed with sign-in only if user doesn't exist or is active
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (!res?.error) {
        toast.success("Successfully logged in");
        router.push(callbackUrl);
      } else {
        toast.error("Invalid email or password");
        form.reset({ password: "" });
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      // For Google sign-in, we'll need to check the user status after they're authenticated
      // This is handled by the callback URL or in a useEffect after login
      await signIn("google", { callbackUrl });
      setIsGoogleLoading(false);
    } catch (error) {
      toast.error("An error occurred with Google sign-in. Please try again.");
      console.error(error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl flex items-center justify-center flex-col mt-8">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src="/assets/logo.png"
            width={40}
            height={40}
            alt="ARE"
            className="object-cover"
          />
          <span className="lg:text-xl tracking-tight font-bold">
            African Real Estate.
          </span>
        </Link>
        <h2 className="mt-1 text-center text-sm font-medium text-gray-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <Card className="px-4 py-4 sm:rounded-lg sm:px-12 bg-white border-neutral-50 shadow-none">
          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Add remember me checkbox if needed */}
                  </div>
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Please wait...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            <div>
              <div className="relative mt-3">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 place-content-center gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-4"
                  disabled={isLoading || isGoogleLoading}
                  onClick={handleGoogleSignIn}
                >
                  {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  ) : (
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 256 262"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                    >
                      <path
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        fill="#4285F4"
                      />
                      <path
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        fill="#34A853"
                      />
                      <path
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        fill="#FBBC05"
                      />
                      <path
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        fill="#EB4335"
                      />
                    </svg>
                  )}

                  <span className="text-sm font-semibold leading-6">
                    Continue with Google
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-1 mb-3 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Get started for free
          </Link>
        </p>
      </div>
    </div>
  );
}
