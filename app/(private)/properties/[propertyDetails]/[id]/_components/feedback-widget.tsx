"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
}

export default function FeedbackWidget() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const onSelectStar = (index: number) => {
    setRating(index + 1);
  };

  const session = useSession();
  const user = session?.data?.user;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      // name: form.name.value,
      // email: form.email.value,
      // feedback: form.feedback.value,
      rating,
    };
    setSubmitted(true);
    console.log(data);
    toast.success("Thank you for Rating");
  };

  const getRatingMessage = (rating: number) => {
    switch (rating) {
      case 1:
        return "😡️ Awful property";
      case 2:
        return "🫡️ Ok property";
      case 3:
        return "🙂️ Good property";
      case 4:
        return "🤩️ Excellent property";
      case 5:
        return "🎉️ Awesome property";
      default:
        return "";
    }
  };

  return (
    <>
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button className="flex items-center gap-2 text-blue-800 rounded-lg bg-blue-100 hover:bg-blue-50 py-1 px-3 transition-all">
            <MessageCircleIcon className="size-4" />
            Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-lg bg-card"> */}
      {submitted ? (
        <div className="flex space-y-2 flex-col text-blue-800 rounded-lg bg-gray-50 p-2 h-full">
          <h3 className="text-base/6 font-bold text-blue-600">Rating</h3>
          {/* <p className="ml-6 text-gray-500/90 text-sm">
            It helps us improve our product and provide better services to our
            customers.
          </p> */}
          <p className="text-gray-500/90 text-sm font-semibold">
            {getRatingMessage(rating)}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-xs">✨️ Rate this property</h3>
          <form onSubmit={submit} className="flex flex-col">
            {/* <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think"
                  className="min-h-[100px]"
                />
              </div> */}

            <div className="flex flex-col items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`size-4 cursor-pointer ${
                      rating > index ? "fill-blue-500" : "fill-white"
                    }`}
                    onClick={() => onSelectStar(index)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full text-sm text-blue-800 rounded-lg bg-blue-100 hover:bg-blue-50 py-0.5 px-3 transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {/* </PopoverContent>
      </Popover> */}
    </>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="lightBlue"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
