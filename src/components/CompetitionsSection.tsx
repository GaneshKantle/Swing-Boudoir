import CompetitionCard from "./CompetitionCard";
import bigGameImage from "@/assets/big-game-competition.jpg";
import hotGirlSummerImage from "@/assets/hot-girl-summer.jpg";
import workoutWarriorImage from "@/assets/workout-warrior.jpg";

const CompetitionsSection = () => {
  const competitions = [
    {
      id: "big-game-weekend",
      title: "Big Game Weekend",
      image: bigGameImage,
      prize: "$50,000 cash prize",
      endDate: "08/31/2025",
      location: "Santa Clara",
      perks: [
        "Trip for 2 to Santa Clara",
        "2 Tickets to Maxim Party",
        "2 Tickets to Big Game",
        "Become a Maxim Content Creator"
      ],
      description: "Join the ultimate Big Game Weekend experience with luxury accommodations and exclusive access to the biggest sporting event of the year.",
      status: "active" as const
    },
    {
      id: "hot-girl-summer",
      title: "Hot Girl Summer - Barbados",
      image: hotGirlSummerImage,
      prize: "$25,000 cash prize",
      endDate: "08/07/2025",
      location: "Miami + Barbados",
      perks: [
        "Trip for 2 to Miami + Barbados",
        "1-on-1 Influencer Masterclass",
        "Portfolio Photoshoot",
        "Maxim Magazine Feature"
      ],
      description: "Experience the ultimate tropical getaway with professional photoshoots and influencer training in paradise.",
      status: "active" as const
    },
    {
      id: "workout-warrior",
      title: "Workout Warrior",
      image: workoutWarriorImage,
      prize: "$20,000 cash prize",
      endDate: "09/27/2025",
      location: "Miami",
      perks: [
        "Maxim Photoshoot",
        "Maxim Magazine Feature",
        "Trip to Miami",
        "Fitness Brand Partnerships"
      ],
      description: "Showcase your fitness journey and dedication with professional photoshoots and brand partnership opportunities.",
      status: "active" as const
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Active Competitions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our exciting competitions and start your journey to winning amazing prizes
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((competition) => (
            <CompetitionCard key={competition.id} {...competition} />
          ))}
        </div>

        {/* More Competitions CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            More competitions launching soon!
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></span>
            <span className="text-accent font-medium">Stay tuned for upcoming opportunities</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionsSection;