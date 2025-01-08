import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image }) => (
  <Card>
    <CardContent className="flex flex-col items-center p-6">
      <Image
        src={image}
        alt={name}
        width={150}
        height={150}
        className="rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold text-primary">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </CardContent>
  </Card>
);

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Mungai Kihara",
      role: "CEO & Founder",
      image: "/assets/placeholder.jpg",
    },
    {
      name: "Vincent K.",
      role: "Head of Sales",
      image: "/assets/placeholder.jpg",
    },
    {
      name: "Ken Mwangi",
      role: "Lead Developer",
      image: "/assets/placeholder.jpg",
    },
    // {
    //   name: "Sarah Brown",
    //   role: "Marketing Director",
    //   image: "/assets/team/sarah-brown.jpg",
    // },
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
        Meet Our Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <TeamMember key={member.name} {...member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
