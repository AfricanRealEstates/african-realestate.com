"use client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const tabs = ["Real Estate", "Mortgage", "Investing", "Home decor"];
export default function Tags() {
  const [selected, setSelected] = useState(tabs[0]);
  return (
    <div className="px-4 py-14 bg-neutral-50 flex items-center flex-wrap gap-2 rounded-md">
      {tabs.map((tab) => (
        <Chip
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
        />
      ))}
    </div>
  );
}

const Chip = ({
  text,
  selected,
  setSelected,
}: {
  text: string;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? "text-white"
          : "text-slate-600 hover:text-slate-200 hover:bg-blue-500"
      } text-sm transition-colors px-3.5 py-1.5 rounded-md relative`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md"
        ></motion.span>
      )}
    </button>
  );
};
