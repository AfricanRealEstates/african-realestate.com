import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role }) => (
  <Card>
    <CardContent className="p-6">
      <blockquote className="text-lg text-muted-foreground mb-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <cite className="flex items-center">
        <span className="font-semibold text-primary">{author}</span>
        <span className="ml-2 text-sm text-muted-foreground">- {role}</span>
      </cite>
    </CardContent>
  </Card>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        "African Real Estate helped me find my dream beachfront property in Zanzibar. Their service was exceptional!",
      author: "Emma K.",
      role: "Property Buyer",
    },
    {
      quote:
        "As a property developer, I've found African Real Estate to be an invaluable partner in showcasing our luxury apartments.",
      author: "David Okonkwo",
      role: "Property Developer",
    },
    {
      quote:
        "The team at African Real Estate made selling my villa in Cape Town a breeze. Highly recommended!",
      author: "Sophie Lelei",
      role: "Agent",
    },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
        What Our Clients Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
