"use client";

import { UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Button, Dropdown } from "antd";
import { HomeIcon, Menu, X } from "lucide-react";
import { Nunito_Sans } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const agentMenu = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/agent/properties" },
  { name: "Account", path: "/agent/account" },
  { name: "Subscriptions", path: "/agent/subscriptions" },
  { name: "Queries", path: "/agent/queries" },
];
const adminMenu = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/admin/properties" },
  { name: "Agents", path: "/admin/agents" },
];

export default function Header() {
  const [currentUser = null, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuToShow = agentMenu, setMenuToShow] = useState<any>(agentMenu);
  const pathname = usePathname();
  const router = useRouter();

  return <></>;
}
