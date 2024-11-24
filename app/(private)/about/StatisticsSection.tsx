import { Card, CardContent } from "@/components/ui/card";

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center p-6">
      <span className="text-4xl font-bold text-gray-400">{value}</span>
      <span className="text-sm text-muted-foreground mt-2">{label}</span>
    </CardContent>
  </Card>
);

const StatisticsSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
        Our Impact
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatItem value="7K+" label="Properties Listed" />
        <StatItem value="1K+" label="Happy Clients" />
        <StatItem value="2+" label="Countries Covered" />
        {/* <StatItem value="$1B+" label="Property Value Sold" /> */}
      </div>
    </section>
  );
};

export default StatisticsSection;
