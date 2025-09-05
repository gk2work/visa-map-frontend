import { Users, Globe, Award, TrendingUp } from "lucide-react";

interface StatItem {
  icon: any;
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: "",
    label: "AWS Activate"
  },
  {
    icon: Globe,
    value: "",
    label: "Microsoft for startup founders hub"
  },
  {
    icon: Award,
    value: "",
    label: "Google for startups"
  },
  {
    icon: TrendingUp,
    value: "",
    label: "Stanford Seed Award finalist"
  }
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary/5 border-t border-primary/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Trusted Badges
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            <b>Your Visa Journey, Backed by Trust & Verified Guidance.</b>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}