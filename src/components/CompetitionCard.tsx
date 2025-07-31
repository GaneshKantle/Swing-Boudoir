import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Camera, Trophy, Users } from "lucide-react";

interface CompetitionCardProps {
  id: string;
  title: string;
  image: string;
  prize: string;
  endDate: string;
  location?: string;
  perks: string[];
  description: string;
  status: 'active' | 'coming-soon' | 'ended';
}

const CompetitionCard = ({
  title,
  image,
  prize,
  endDate,
  location,
  perks,
  description,
  status
}: CompetitionCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'coming-soon':
        return <Badge className="bg-blue-500 text-white">Coming Soon</Badge>;
      case 'ended':
        return <Badge className="bg-gray-500 text-white">Ended</Badge>;
      default:
        return null;
    }
  };

  const getPerkIcon = (perk: string) => {
    if (perk.toLowerCase().includes('cash') || perk.toLowerCase().includes('$')) {
      return <DollarSign className="w-4 h-4" />;
    }
    if (perk.toLowerCase().includes('trip') || perk.toLowerCase().includes('travel')) {
      return <MapPin className="w-4 h-4" />;
    }
    if (perk.toLowerCase().includes('photoshoot') || perk.toLowerCase().includes('photo')) {
      return <Camera className="w-4 h-4" />;
    }
    if (perk.toLowerCase().includes('tickets') || perk.toLowerCase().includes('event')) {
      return <Users className="w-4 h-4" />;
    }
    return <Trophy className="w-4 h-4" />;
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-luxury transition-luxury bg-card border-border">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-luxury"
        />
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-luxury"></div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-smooth">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Prize */}
        <div className="flex items-center mb-4 p-3 rounded-lg bg-gradient-competition/10 border border-competition/20">
          <DollarSign className="w-5 h-5 text-competition mr-2" />
          <span className="font-semibold text-competition text-lg">{prize}</span>
        </div>

        {/* End Date */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Registration ends {endDate}</span>
        </div>

        {/* Location (if available) */}
        {location && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
        )}

        {/* Perks */}
        <div className="space-y-2 mb-6">
          {perks.slice(0, 3).map((perk, index) => (
            <div key={index} className="flex items-center text-sm text-foreground">
              {getPerkIcon(perk)}
              <span className="ml-2">{perk}</span>
            </div>
          ))}
          {perks.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{perks.length - 3} more benefits
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-gradient-competition text-competition-foreground hover:opacity-90 transition-smooth"
          disabled={status === 'ended'}
        >
          {status === 'ended' ? 'Competition Ended' : 'Register Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompetitionCard;