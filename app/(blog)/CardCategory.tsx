import Image from "next/image";
import { format } from "date-fns";
interface CardCategoryProps {
  cover: string;
  title: string;
  summary: string;
  date: Date;
  viewCount: number;
  // likes: number;
}

export default function CardCategory({
  cover,
  title,
  summary,
  date,
  viewCount,
  // likes,
}: CardCategoryProps) {
  return (
    <article className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 bg-opacity-50 shadow-2xl shadow-gray-600/10">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={cover}
          alt={title}
          width={1000}
          height={667}
          className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-6 relative">
        <h3 className="text-2xl font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground mt-3">
          <time dateTime={date.toISOString()}>
            {format(date, "MMMM dd, yyyy")}
          </time>
          <div className="flex items-center gap-2">
            <span>{viewCount} views</span>
            <span>•</span>
            {/* <span>{likes} likes</span> */}
          </div>
        </div>
        <p className="leading-relaxed mt-4 text-gray-600 line-clamp-3">
          {summary}
        </p>
        <p className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2 mt-5 w-fit">
          <span className="text-ken-primary">Read more</span>
        </p>
      </div>
    </article>
  );
}
