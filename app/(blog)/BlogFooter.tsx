"use client";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, navItems, TikTok, YouTube } from "./BlogHeader";
import Image from "next/image";

export default function BlogFooter() {
  return (
    <footer className="w-full bg-gray-50 py-16">
      <div className="md:px-12 lg:px-28">
        <div className="container m-auto space-y-6 text-gray-600 max-w-7xl flex flex-col items-center justify-center w-full">
          <Link href="/" className={`flex items-center gap-2 no-underline`}>
            <img
              src="/assets/logo.png"
              width={40}
              height={40}
              alt="ARE"
              className="object-cover"
            />
            {/* <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
              <HomeIcon />
            </span> */}
            <span className={`lg:text-xl tracking-tight font-bold`}>
              African Real Estate.
            </span>
          </Link>

          <ul
            role="list"
            className="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-8"
          >
            {navItems.map((item) => {
              return (
                <li className="hover:text-ken-primary" key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
          <div className="m-auto flex w-max items-center justify-between space-x-4">
            <Link
              href={"https://web.facebook.com/AfricanRealEstateMungaiKihara"}
              target="_blank"
              rel="noopener norefferer"
            >
              <Facebook />
            </Link>
            <Link
              href={"https://www.tiktok.com/@africanrealestate"}
              target="_blank"
              rel="noopener norefferer"
            >
              <TikTok />
            </Link>
            <Link
              href={"https://www.youtube.com/c/AfricanRealEstate"}
              target="_blank"
              rel="noopener norefferer"
            >
              <YouTube />
            </Link>
            <Link
              href={"https://www.instagram.com/africanrealestate_/"}
              target="_blank"
              rel="noopener norefferer"
            >
              <Instagram />
            </Link>
          </div>
          <div className="text-center">
            <span className="text-sm tracking-wide">
              &copy; {new Date().getFullYear()} African Real Estate | All rights
              reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
