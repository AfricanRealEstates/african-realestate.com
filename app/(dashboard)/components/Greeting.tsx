"use client";
import React, { useEffect, useState } from "react";
export default function Greeting({ name }: { name: string }) {
  // State to hold the dynamic greeting
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div>
      {greeting}, {name}
    </div>
  );
}
