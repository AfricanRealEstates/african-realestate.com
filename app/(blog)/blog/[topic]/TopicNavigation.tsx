import Link from "next/link";

interface TopicNavigationProps {
  currentTopic: string;
  availableTopics: { id: string; label: string }[];
}

export default function TopicNavigation({
  currentTopic,
  availableTopics,
}: TopicNavigationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {availableTopics.map((topic) => (
        <Link
          href={`/blog/${topic.id}`}
          key={topic.id}
          className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${
            currentTopic === topic.id
              ? "bg-sky-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 opacity-80"
          }`}
        >
          {topic.label}
        </Link>
      ))}
    </div>
  );
}
