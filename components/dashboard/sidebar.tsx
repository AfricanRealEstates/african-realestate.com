"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRightIcon,
  Home,
  Layout,
  Library,
  MoreVertical,
  PencilIcon,
  ShoppingBasket,
  UserCircle,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    setSelectedProject(null);
  };

  return (
    <motion.aside
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      className="bg-neutral-50 flex flex-col p-5 z-10 gap-20 absolute top-0 left-0 h-full shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]"
    >
      <div className="flex flex-row w-full justify-between place-items-center">
        <Link
          href="/"
          className="overflow-hidden whitespace-nowrap w-10 h-10 flex items-center justify-center text-white font-semibold bg-gradient-to-br from-red-500 to-amber-500 rounded-full"
        >
          <Home />
        </Link>
        <button
          className="p-1 rounded-full flex"
          onClick={() => handleOpenClose()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 stroke-neutral-400"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={svgVariants}
              animate={svgControls}
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <NavigationLink name="Dashboard" href="/dashboard">
          <Layout className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Properties" href="/dashboard/properties">
          <Library className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Customers" href="/dashboard/customers">
          <UsersRound className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
        <NavigationLink name="Sales" href="/dashboard/sales">
          <ShoppingBasket className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLink>
      </div>
      <div className="flex flex-col gap-3">
        <ProjectLink
          name="Updates"
          setSelectedProject={setSelectedProject}
          href="#"
        >
          <div className="min-w-4 w-4 mx-2 border-pink-600 border rounded-full aspect-square bg-pink-700" />
        </ProjectLink>
        <ProjectLink
          name="Offers"
          setSelectedProject={setSelectedProject}
          href="#"
        >
          <div className="min-w-4 w-4 mx-2 border-indigo-600 border rounded-full aspect-square bg-indigo-700" />
        </ProjectLink>
        <ProjectLink
          name="Discounts"
          setSelectedProject={setSelectedProject}
          href="#"
        >
          <div className="min-w-4 w-4 mx-2 border-emerald-600 border rounded-full aspect-square bg-emerald-700" />
        </ProjectLink>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Image
          src="/assets/placeholder.jpg"
          height={39}
          width={39}
          alt="User"
          className=" rounded-full object-cover"
        />
        <div className="flex flex-col overflow-hidden whitespace-nowrap">
          <h3>Ken Mwangi</h3>
          <p className="text-xs text-neutral-500">kenmwangi@email.com</p>
        </div>
        <MoreVertical />
      </div>
    </motion.aside>
  );
}

interface NavigationLinkProps {
  children: ReactNode;
  name: string;
  href: string;
}
const NavigationLink = ({ children, name, href }: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className="p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-400 stroke-neutral-400 text-neutral-400 hover:text-neutral-500 place-items-center gap-3 hover:bg-neutral-100 transition-colors duration-100"
    >
      {children}
      <p className="text-inherit overflow-hidden whitespace-nowrap tracking-wide">
        {name}
      </p>
    </Link>
  );
};

interface ProjectLinkProps {
  href: string;
  children: ReactNode;
  name: string;
  setSelectedProject: (val: string | null) => void;
}

const ProjectLink = ({
  href,
  children,
  name,
  setSelectedProject,
}: ProjectLinkProps) => {
  const handleClick = () => {
    setSelectedProject(name);
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      className="p-1 rounded flex cursor-pointer stroke-[0.75] hover:stroke-neutral-400 stroke-neutral-400 text-neutral-400 hover:text-neutral-500 place-items-center gap-3 hover:bg-neutral-100 transition-colors duration-100"
    >
      {children}
      <div className="flex overflow-hiden place-items-center justify-between w-full">
        <p className="text-inherit truncate whitespace-nowrap tracking-wide">
          {name}
        </p>
        <ChevronRightIcon className="font-bold stroke-inherit stroke-[0.75] min-w-8 w-8" />
      </div>
    </Link>
  );
};

const variants = {
  close: {
    x: -300,
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 100,
  },
};

interface ProjectNavigationProps {
  selectedProject: string;
  isOpen: boolean;
  setSelectedProject: (project: string | null) => void;
}

const ProjectNavigation = ({
  selectedProject,
  isOpen,
  setSelectedProject,
}: ProjectNavigationProps) => {
  return (
    <>
      <motion.nav
        variants={variants}
        initial="close"
        animate="open"
        exit="close"
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className={`h-full flex flex-col gap-8 w-64 absolute bg-neutral-900 ml-0 ${
          isOpen ? "left-64" : "left-20"
        } border-r border-neutral-800 p-5`}
      >
        <div className="flex flex-row w-full justify-between place-items-center">
          <h2 className="tracking-wide text-neutral-500 text-lg">
            {selectedProject}
          </h2>
          <button>
            <X className="w-8 h-8 stroke-neutral-400" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-2 tracking-wide rounded-lg bg-neutral-600/40 text-neutral-100"
        />
        <div className="flex flex-col gap-3">
          <NavigationLink name="In Review" href="#">
            <PencilIcon className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
          </NavigationLink>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="tracking-wide text-neutral-300">Team Members</h2>
          <Link href="#" className="flex flex-row gap-3 place-items-center">
            <UserCircle className="stroke-inherit" />
          </Link>
        </div>
      </motion.nav>
      <AnimatePresence>
        {selectedProject && (
          <ProjectNavigation
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};
