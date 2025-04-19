import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

export const metadata = getSEOTags({
  title: "Careers | African Real Estate",
  description:
    "Join our team at African Real Estate. Explore current job openings and opportunities to grow your career in the real estate industry.",
  canonicalUrlRelative: "jobs",
});

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

// This would typically come from a database or CMS
// const jobOpenings = [
//   {
//     id: 1,
//     title: "Senior Real Estate Agent",
//     department: "Sales",
//     location: "Nairobi, Kenya",
//     type: "Full-time",
//     description:
//       "We're looking for an experienced real estate agent to join our team in Nairobi. The ideal candidate will have a proven track record in property sales and excellent client relationship skills.",
//     requirements: [
//       "Minimum 3 years experience in real estate sales",
//       "Valid real estate license",
//       "Strong negotiation and communication skills",
//       "Knowledge of the Nairobi property market",
//       "Self-motivated with ability to work independently",
//     ],
//     responsibilities: [
//       "Generate and follow up on leads",
//       "Conduct property viewings and presentations",
//       "Negotiate sales and rental agreements",
//       "Maintain client relationships",
//       "Stay updated on market trends and property values",
//     ],
//   },
//   {
//     id: 2,
//     title: "Digital Marketing Specialist",
//     department: "Marketing",
//     location: "Nairobi, Kenya",
//     type: "Full-time",
//     description:
//       "We're seeking a Digital Marketing Specialist to develop and implement marketing strategies for our online platforms. The ideal candidate will have experience in real estate or property marketing.",
//     requirements: [
//       "Bachelor's degree in Marketing, Communications, or related field",
//       "2+ years experience in digital marketing",
//       "Proficiency in social media management and SEO",
//       "Experience with Google Analytics and digital advertising platforms",
//       "Strong analytical and creative skills",
//     ],
//     responsibilities: [
//       "Develop and execute digital marketing campaigns",
//       "Manage social media accounts and content calendar",
//       "Optimize website content for SEO",
//       "Analyze campaign performance and provide reports",
//       "Collaborate with the sales team to generate leads",
//     ],
//   },
//   {
//     id: 3,
//     title: "Property Photographer",
//     department: "Content",
//     location: "Nairobi, Kenya",
//     type: "Part-time",
//     description:
//       "We're looking for a skilled photographer to capture high-quality images of properties for our listings. The ideal candidate will have experience in real estate or architectural photography.",
//     requirements: [
//       "Portfolio demonstrating real estate or architectural photography skills",
//       "Own professional photography equipment",
//       "Knowledge of photo editing software",
//       "Reliable transportation",
//       "Flexible schedule",
//     ],
//     responsibilities: [
//       "Schedule and conduct property photoshoots",
//       "Edit and optimize images for web and print",
//       "Capture property features in the best light",
//       "Coordinate with agents and property owners",
//       "Meet deadlines for listing publications",
//     ],
//   },
//   {
//     id: 4,
//     title: "Customer Support Representative",
//     department: "Customer Service",
//     location: "Remote (Kenya)",
//     type: "Full-time",
//     description:
//       "We're seeking a Customer Support Representative to assist our clients with inquiries and provide exceptional service. The ideal candidate will be patient, empathetic, and have excellent communication skills.",
//     requirements: [
//       "Previous customer service experience",
//       "Excellent verbal and written communication skills",
//       "Ability to multitask and prioritize",
//       "Basic knowledge of real estate terminology",
//       "Proficiency in English and Swahili",
//     ],
//     responsibilities: [
//       "Respond to customer inquiries via phone, email, and chat",
//       "Assist clients with navigating the platform",
//       "Escalate complex issues to appropriate departments",
//       "Maintain customer records and follow up on inquiries",
//       "Provide feedback for service improvement",
//     ],
//   },
// ];
const jobOpenings: Job[] = [];

export default function JobsPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Join Our Team
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover exciting career opportunities at African Real Estate.
            We&apos;re looking for talented individuals who are passionate about
            transforming the real estate industry in Africa.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Why Work With Us
              </h2>
              <ul className="mt-8 space-y-8">
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Innovation-Driven Culture
                    </h3>
                    <p className="mt-2 text-gray-600">
                      We&apos;re at the forefront of transforming the real
                      estate industry in Africa through technology and
                      innovative solutions.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Growth Opportunities
                    </h3>
                    <p className="mt-2 text-gray-600">
                      We invest in our team&apos;s professional development with
                      training, mentorship, and clear career advancement paths.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Diverse and Inclusive Workplace
                    </h3>
                    <p className="mt-2 text-gray-600">
                      We celebrate diversity and create an inclusive environment
                      where everyone&apos;s contributions are valued.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Competitive Compensation
                    </h3>
                    <p className="mt-2 text-gray-600">
                      We offer competitive salaries, performance bonuses, and
                      comprehensive benefits packages.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gray-50 p-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Our Hiring Process
              </h2>
              <ol className="mt-8 space-y-8">
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Application Review
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Our recruitment team reviews your application and resume
                      to assess your qualifications and experience.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Initial Interview
                    </h3>
                    <p className="mt-2 text-gray-600">
                      A phone or video interview to discuss your background,
                      skills, and interest in the role.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Skills Assessment
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Depending on the role, you may be asked to complete a task
                      or assessment to demonstrate your skills.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Final Interview
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Meet with the team and leadership to discuss the role in
                      detail and ensure mutual fit.
                    </p>
                  </div>
                </li>
                <li className="flex gap-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Offer & Onboarding
                    </h3>
                    <p className="mt-2 text-gray-600">
                      If selected, you&apos;ll receive an offer and begin our
                      comprehensive onboarding process.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Current Openings
          </h2>
          <div className="mt-10 space-y-8">
            {jobOpenings.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-muted/30 rounded-2xl shadow-inner">
                <div className="text-5xl mb-4">👀</div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  No Job Openings Right Now
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  We&apos;re not hiring at the moment, but new opportunities are
                  always around the corner. Check back soon or follow us for
                  updates.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="https://web.facebook.com/AfricanRealEstateMungaiKihara"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-primary transition-colors"
                  >
                    <Facebook />
                  </Link>
                  <Link
                    href="https://www.youtube.com/c/AfricanRealEstate"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="hover:text-primary transition-colors"
                  >
                    <Youtube />
                  </Link>
                  {/* <a
                    href="https://www.tiktok.com/@africanrealestate"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="hover:text-primary transition-colors"
                  >
                    <TikTok />
                  </a> */}
                  <Link
                    href="https://www.instagram.com/africanrealestate_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-primary transition-colors"
                  >
                    <Instagram />
                  </Link>
                  <Link
                    href="https://twitter.com/AfricanRealEsta"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="hover:text-primary transition-colors"
                  >
                    <Twitter />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/african-real-estate"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-primary transition-colors"
                  >
                    <Linkedin />
                  </Link>
                </div>
              </div>
            ) : (
              jobOpenings.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-x-2">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Button asChild>
                        <Link href={`/jobs/${job.id}`}>
                          Apply Now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{job.description}</p>
                  <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Requirements
                      </h4>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        {job.requirements.map((requirement, index) => (
                          <li key={index} className="flex gap-x-3">
                            <svg
                              className="h-5 w-5 flex-none text-blue-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Responsibilities
                      </h4>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex gap-x-3">
                            <svg
                              className="h-5 w-5 flex-none text-blue-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-7xl">
          <div className="rounded-2xl bg-blue-50 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Don&apos;t see a role that fits?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;re always looking for talented individuals to join our
              team. Send us your resume and we&apos;ll keep you in mind for
              future opportunities.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild>
                <Link href="/contact">Submit General Application</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
