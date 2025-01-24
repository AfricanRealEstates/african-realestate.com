import { Badge } from "@/components/ui/badge";

interface TopicSelectorProps {
  availableTopics: string[];
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
}

export default function TopicSelector({
  availableTopics,
  selectedTopics,
  onChange,
}: TopicSelectorProps) {
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onChange(selectedTopics.filter((t) => t !== topic));
    } else {
      onChange([...selectedTopics, topic]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableTopics.map((topic) => (
        <Badge
          key={topic}
          variant={selectedTopics.includes(topic) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleTopic(topic)}
        >
          {topic}
        </Badge>
      ))}
    </div>
  );
}
