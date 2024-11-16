import { IconChartBar, IconUsers, IconTrophy, IconClipboardList } from '@tabler/icons-react';

const features = [
  {
    icon: IconChartBar,
    title: "Live Rankings",
    description: "Real-time standings and statistics updated automatically after each match."
  },
  {
    icon: IconUsers,
    title: "Team Management",
    description: "Easily manage teams, players, and group assignments."
  },
  {
    icon: IconTrophy,
    title: "Tournament Tracking",
    description: "Track multiple tournaments with customizable formats and rules."
  },
  {
    icon: IconClipboardList,
    title: "Match Scheduling",
    description: "Organize fixtures and keep track of upcoming matches."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 