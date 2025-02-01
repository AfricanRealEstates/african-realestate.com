"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopicFilterProps {
  topics: string[];
  onTopicChange: (topic: string) => void;
}

export function TopicFilter({ topics, onTopicChange }: TopicFilterProps) {
  const [activeTopic, setActiveTopic] = useState("All");

  const handleTopicClick = (topic: string) => {
    setActiveTopic(topic);
    onTopicChange(topic);
  };

  return (
    <nav className="flex md:flex-col gap-4 overflow-x-auto pb-4 md:pb-0 whitespace-nowrap md:mx-0 scrollbar-hide">
      {topics.map((topic) => (
        <Button
          key={topic}
          variant="ghost"
          className={cn("justify-start", activeTopic === topic && "bg-muted")}
          onClick={() => handleTopicClick(topic)}
        >
          {topic}
        </Button>
      ))}
    </nav>
  );
}
