import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
const Arrow = ({ extraStyle }: { extraStyle: string }) => {
  return (
    <svg
      className={`shrink-0 w-12 fill-gray-500 opacity-70 ${extraStyle}`}
      viewBox="0 0 138 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M72.9644 5.31431C98.8774 43.8211 83.3812 88.048 54.9567 120.735C54.4696 121.298 54.5274 122.151 55.0896 122.639C55.6518 123.126 56.5051 123.068 56.9922 122.506C86.2147 88.9044 101.84 43.3918 75.2003 3.80657C74.7866 3.18904 73.9486 3.02602 73.3287 3.44222C72.7113 3.85613 72.5484 4.69426 72.9644 5.31431Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.5084 121.007C56.9835 118.685 57.6119 115.777 57.6736 115.445C59.3456 106.446 59.5323 97.67 58.4433 88.5628C58.3558 87.8236 57.6824 87.2948 56.9433 87.3824C56.2042 87.4699 55.6756 88.1435 55.7631 88.8828C56.8219 97.7138 56.6432 106.225 55.0203 114.954C54.926 115.463 53.5093 121.999 53.3221 123.342C53.2427 123.893 53.3688 124.229 53.4061 124.305C53.5887 124.719 53.8782 124.911 54.1287 125.015C54.4123 125.13 54.9267 125.205 55.5376 124.926C56.1758 124.631 57.3434 123.699 57.6571 123.487C62.3995 120.309 67.4155 116.348 72.791 113.634C77.9171 111.045 83.3769 109.588 89.255 111.269C89.9704 111.475 90.7181 111.057 90.9235 110.342C91.1288 109.626 90.7117 108.878 89.9963 108.673C83.424 106.794 77.3049 108.33 71.5763 111.223C66.2328 113.922 61.2322 117.814 56.5084 121.007Z"
        />
      </g>
    </svg>
  );
};

const Step = ({ step, text }: { step: number; text: string }) => {
  return (
    <div className="w-full md:w-48 flex flex-col gap-2 items-center justify-center">
      <div className="flex size-9 items-center justify-center rounded-full bg-[#3b82f6] ">
        <p className="text-xl font-bold text-white">{step}</p>
      </div>
      <h3 className="font-bold">{text}</h3>
    </div>
  );
};

export default function Sales() {
  return (
    <section className={`${raleway.className} border-b border-neutral-100 `}>
      <div className="mx-auto w-[95%] max-w-7xl px-5 py-8 md:px-10 md:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-bold md:text-5xl mt-4 mb-6 md:mb-8 text-[#181a20]">
            Why African Real Estate
          </h2>
          <p className="max-w-xl mx-auto text-lg text-center opacity-90 leading-relaxed mb-12 md:mb-20 text-[#4e4e4e]">
            Use our simple platform to create, manage and sell your properties.
            One stop solution for your real estate needs.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
            <Step step={1} text="Create an Account" />
            <Arrow extraStyle="max-md:-scale-x-100 md:-rotate-90" />
            <Step step={2} text=" Add Your Property" />
            <Arrow extraStyle="md:-scale-x-100 md:-rotate-90" />
            <Step step={3} text="Track progress" />
          </div>
        </div>
      </div>
    </section>
  );
}
