import BlogFooter from "./BlogFooter";
import BlogNav from "./BlogNav";

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={``}>
      <BlogNav />
      <main className="container pt-16">{children}</main>
      <BlogFooter />
    </div>
  );
}
