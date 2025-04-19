import { Button } from "@/components/ui/button";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = getSEOTags({
  title: "Frequently Asked Questions | African Real Estate",
  description:
    "Find answers to common questions about buying, selling, and renting properties in Africa.",
  canonicalUrlRelative: "faq",
});

const faqCategories = [
  {
    title: "For Buyers",
    questions: [
      {
        question: "How do I start my property search?",
        answer:
          "You can start your property search by using our search filters on the homepage. Filter by location, property type, price range, and more to find properties that match your criteria. You can also contact our agents directly for personalized assistance.",
      },
      {
        question: "What documents do I need to buy property in Kenya?",
        answer:
          "To buy property in Kenya, you'll need identification documents (ID/passport), KRA PIN, proof of funds, and bank statements. For foreigners, additional documentation may be required. Our agents can guide you through the specific requirements based on your situation.",
      },
      {
        question: "How long does the buying process take?",
        answer:
          "The property buying process in Kenya typically takes 60-90 days from offer acceptance to completion. This includes due diligence, contract signing, payment processing, and title transfer. Timelines may vary based on property type and location.",
      },
      {
        question: "Are there financing options available?",
        answer:
          "Yes, we work with several partner banks and financial institutions that offer mortgage options for property purchases. Interest rates and terms vary, so we recommend speaking with our financial advisors to find the best option for your situation.",
      },
      {
        question: "Can foreigners buy property in Kenya?",
        answer:
          "Yes, foreigners can buy property in Kenya, but with some restrictions. Foreigners can only obtain leasehold titles (up to 99 years) for land, not freehold titles. There are no restrictions for apartment or house purchases. Our legal team can provide detailed guidance.",
      },
    ],
  },
  {
    title: "For Sellers",
    questions: [
      {
        question: "How do I list my property on African Real Estate?",
        answer:
          "To list your property, create an account, select 'Sell' from the dashboard, and follow the step-by-step process to add property details, photos, and pricing. Choose a listing plan that suits your needs. Our team will review and publish your listing within 24 hours.",
      },
      {
        question:
          "What are the fees for selling property through your platform?",
        answer:
          "We offer different listing packages starting from KES 400 per listing. Premium packages include enhanced visibility, featured placement, and marketing support. There are no hidden fees or commissions on sales unless you opt for our full-service agent representation.",
      },
      {
        question: "How long will it take to sell my property?",
        answer:
          "Selling timelines vary based on property type, location, condition, and pricing. Well-priced properties in popular areas typically sell within 30-60 days. Our market insights and pricing guidance can help you optimize your listing for a faster sale.",
      },
      {
        question: "What documents do I need to sell my property?",
        answer:
          "Required documents include your title deed, land rate receipts, consent to transfer from the land control board (for agricultural land), tax clearance certificates, and identification documents. Our legal team can help ensure you have all necessary paperwork.",
      },
      {
        question: "Do you offer professional photography services?",
        answer:
          "Yes, our Super Agent package includes professional photography and video services. For other packages, we offer these services at an additional fee. High-quality visuals significantly improve listing performance and attract more potential buyers.",
      },
    ],
  },
  {
    title: "For Renters",
    questions: [
      {
        question: "What is the typical lease duration in Kenya?",
        answer:
          "Standard residential leases in Kenya are typically for 12 months, with options to renew. Commercial leases often range from 2-5 years. Some landlords offer shorter-term leases of 3-6 months, usually at a premium rate.",
      },
      {
        question: "What fees should I expect when renting a property?",
        answer:
          "When renting, you'll typically need to pay a security deposit (usually 1-3 months' rent), the first month's rent in advance, and sometimes a service charge for maintenance. Agent fees, if applicable, are typically one month's rent.",
      },
      {
        question: "Are utilities included in the rent?",
        answer:
          "Most rental properties in Kenya do not include utilities in the rent. Tenants are typically responsible for electricity, water, internet, and garbage collection fees. Some apartment complexes may include certain utilities or have service charges that cover some utilities.",
      },
      {
        question: "Can I negotiate the rent?",
        answer:
          "Yes, rent is often negotiable, especially for longer lease terms or in areas with high vacancy rates. Our agents can advise on reasonable negotiation strategies based on current market conditions and the specific property.",
      },
      {
        question: "What happens if I need to break my lease early?",
        answer:
          "Most leases include terms for early termination, typically requiring 1-3 months' notice. Some landlords may charge a penalty fee. We recommend reviewing the lease agreement carefully and discussing options with your landlord or property manager if circumstances change.",
      },
    ],
  },
  {
    title: "About Our Platform",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Creating an account is simple. Click on 'Log in' at the top of the page, then select 'Create account'. Fill in your details, verify your email, and you're ready to go. You can also sign up using your Google, Facebook, or Apple account for faster registration.",
      },
      {
        question: "Are the properties verified?",
        answer:
          "Yes, we verify all properties listed on our platform. Our team conducts basic verification checks on ownership documents and property details. Premium listings undergo enhanced verification including physical site visits. Look for the 'Verified' badge on listings.",
      },
      {
        question: "How do I contact an agent about a property?",
        answer:
          "Each property listing includes contact options. You can click the 'Contact Agent' button, fill out the inquiry form, or use the provided phone number to call directly. For immediate assistance, you can also use our live chat feature during business hours.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "We take data security seriously. Your personal information is encrypted and stored securely. We never share your contact details with third parties without your consent. For more information, please review our Privacy Policy.",
      },
      {
        question: "Do you offer property management services?",
        answer:
          "Yes, we offer comprehensive property management services for landlords, including tenant screening, rent collection, maintenance coordination, and financial reporting. Contact our property management team for customized solutions and pricing.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find answers to common questions about buying, selling, and renting
            properties in Africa. Can&apos;t find what you&apos;re looking for?
            Contact our{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-500">
              support team
            </Link>
            .
          </p>
        </div>

        <div className="mt-20">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-blue-50 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our team is here to help. Contact us for personalized assistance
            with any questions about properties or our services.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="tel:+254732945534">Call Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
