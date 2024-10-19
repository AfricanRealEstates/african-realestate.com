"use client";
import React, { useState } from "react";
import { Button } from "@/components/utils/Button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginUserInput, loginUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Icons } from "../globals/icons";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      setIsLoading(false);

      if (!res?.error) {
        toast.success(`Successfully logged in`);
        router.push(callbackUrl);
      } else {
        const message = "Invalid email or password";
        toast.error("Uh oh! Something went wrong");
        setError(message);
        reset({ password: "" });
      }
    } catch (error: any) {
      toast.error("Uh oh! Something went wrong");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl flex items-center justify-center flex-col mt-12">
        <Link href="/" className={`flex items-center gap-2 no-underline`}>
          <img
            src="/assets/logo.png"
            width={40}
            height={40}
            alt="ARE"
            className="object-cover"
          />
          <span className={`lg:text-xl tracking-tight font-bold`}>
            African Real Estate.
          </span>
        </Link>
        <h2 className="mt-4 text-center text-lg font-medium leading-9 tracking-tight text-gray-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 border border-gray-200 sm:rounded-lg sm:px-12">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmitHandler)}>
            {error && (
              <p className="text-center bg-rose-50 text-rose-500 py-4 mb-6 rounded">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="john.doe@email.com"
                  className="p-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors["email"] && (
                <span className="text-rose-500 text-xs pt-1 block">
                  {errors["email"]?.message as string}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="p-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors["password"] && (
                <span className="text-rose-500 text-xs pt-1 block">
                  {errors["password"]?.message as string}
                </span>
              )}
            </div>

            <div>
              <Button
                color="blue"
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Please wait...
                  </div>
                ) : (
                  <>Sign in</>
                )}
              </Button>
            </div>
          </form>

          <div>
            <div className="relative mt-10">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 place-content-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-4"
                disabled={isLoading || isGoogleLoading}
                onClick={() => {
                  setIsGoogleLoading(true);
                  signIn("google", { callbackUrl });
                }}
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
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Get started for free
          </Link>
        </p>
      </div>
    </div>
  );
}
