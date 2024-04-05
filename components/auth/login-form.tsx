"use client";
import { LoginInputProps } from "@/types/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInputProps>();

  const onSubmit = async (data: LoginInputProps) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with credentials:", data);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
        callbackUrl,
      });
      console.log("SignIn response:", loginData);
      if (loginData?.error) {
        setIsLoading(false);

        toast.error("Invalid email or password");
        router.push(callbackUrl);
        setShowNotification(true);
      } else {
        setShowNotification(false);
        reset();
        setIsLoading(false);
        toast.success("Login successful");
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network Error:", error);
      toast.error("Network error!");
    }
  };
  return (
    <div>
      <section className="mx-auto w-full max-w-3xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <div className="max-w-xl mx-auto px-8 py-12 text-center bg-gray-200 rounded-lg">
          <h2 className="text-3xl font-bold md:text-5xl text-blue-300">
            Welcome Back
          </h2>
          <p className="mx-auto my-5 max-w-md text-sm sm:text-base lg:mb-8 text-gray-400">
            Sign in to continue with African Real Estate
          </p>
          <div className="mx-auto w-full max-w-[400px]">
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="flex w-full max-w-full justify-center gap-5 items-center rounded-md bg-blue-100 hover:bg-gray-300 hover:text-gray-400 transition py-3 text-blue-400"
            >
              <svg
                width="16"
                height="22"
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

              <p className="text-sm md:text-base font-semibold">
                Continue with Google
              </p>
            </button>
            {/* Divider */}
            <div className="my-14 flex w-full justify-around text-gray-400">
              <img src="/assets/icons/line.svg" className="hidden md:block" />
              <p>or sign in with email</p>
              <img src="/assets/icons/line.svg" className="hidden md:block" />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mb-4 max-w-[400px] pb-4"
            >
              {showNotification && (
                <div
                  className="p-4 mb-4 text-sm rounded-lg bg-red-50  text-red-400"
                  role="alert"
                >
                  <span className="font-medium">Sign-in error!</span> Please
                  check your credentials.
                </div>
              )}
              <div className="text-left">
                <label htmlFor="email" className="mb-4 text-sm">
                  Email
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  name="email"
                  id="email"
                  // className="mb-4 text-black block h-9 w-full rounded-md border border-solid border-gray-500 px-3 py-6 pl-4 text-sm placeholder:text-gray-400 focus:border-blue-300 outline-none"
                  className="peer w-full rounded border border-neutral-300 h-9 px-3 py-6 my-4  text-sm focus:border-indigo-500 focus:outline-none ring-1 ring-neutral-500/0 ring-offset-0 transition-shadow focus:ring-indigo-500 focus:ring-offset-2"
                  placeholder="Email address"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Email is required
                  </span>
                )}
              </div>
              <div className="text-left">
                <label htmlFor="password" className="mb-2 text-sm">
                  Password
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  className="peer w-full rounded border border-neutral-300 h-9 px-3 py-6 my-4  text-sm focus:border-indigo-500 focus:outline-none ring-1 ring-neutral-500/0 ring-offset-0 transition-shadow focus:ring-indigo-500 focus:ring-offset-2"
                  placeholder="Password (min 6 characters)"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    Password is required
                  </span>
                )}
              </div>
              <button
                disabled={isLoading}
                className="mt-4 inline-block w-full cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-6 py-3 text-center font-semibold text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>
          <p className="text-sm text-[#636262]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-300 hover:text-blue-400 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
