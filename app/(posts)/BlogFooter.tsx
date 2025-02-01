import Link from "next/link";
import { Facebook, Instagram, TikTok } from "./BlogNav";

const footerLinks = [
  {
    title: "Product",
    subtitles: ["Properties", "Pricing", "Property Management"],
  },
  {
    title: "Company",
    subtitles: ["About Us", "Contact", "Blog"],
  },
  {
    title: "Legal",
    subtitles: ["Privacy Policy", "Terms of Service"],
  },
];

export default function BlogFooter() {
  return (
    <footer className="flex flex-col sm:flex-row justify-between mt-32 pb-8 sm:py-14 sm:border-t w-full max-w-[1440px] mx-auto px-6 lg:px-20">
      <section className="flex flex-col max-sm:items-center sm:mb-0 mb-1">
        <div className="mb-6">
          <div className="flex flex-col gap-1.5">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <img
                src="/assets/logo.png"
                width={40}
                height={40}
                alt="ARE"
                className="object-cover"
              />
              <span className="lg:text-xl font-semibold">
                African Real Estate.
              </span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href={"https://web.facebook.com/AfricanRealEstateMungaiKihara"}
                target="_blank"
                rel="noopener norefferer"
                className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
              >
                <Facebook />
              </Link>
              <Link
                href={"https://www.tiktok.com/@africanrealestate"}
                target="_blank"
                rel="noopener norefferer"
                className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
              >
                <TikTok />
              </Link>
              <Link
                href={"https://www.instagram.com/africanrealestate_/"}
                target="_blank"
                rel="noopener norefferer"
              >
                <Instagram />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-3 gap-4 justify-center content-center sm:gap-12 text-foreground text-[14px]">
        {footerLinks.map((category) => (
          <div key={category.title} className="max-sm:text-center">
            <h3 className="font-bold text-foreground mb-3">{category.title}</h3>
            <ul className="space-y-3">
              {category.subtitles.map((subtitle) => (
                <li key={subtitle} className="hover:underline cursor-pointer">
                  <Link href="#" className="hover:underline">
                    {subtitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </footer>
  );
}
