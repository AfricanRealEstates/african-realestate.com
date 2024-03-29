import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="flex flex-col h-[75vh] items-center justify-center gap-y-6">
        <h2 className="text-3xl text-center font-bold md:text-5xl">
          Oops! Not found
        </h2>
        <Link
          href="/"
          className="hover:text-blue-500 hover:underline transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

// export default function NotFound() {
//   return (
//     <div>
//       <h2>Not Found</h2>
//       <p>Could not find requested resource</p>
//     </div>
//   );
// }
