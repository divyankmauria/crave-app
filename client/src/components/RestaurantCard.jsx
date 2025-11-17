import { Star, MapPin, Phone, ExternalLink, Bookmark } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RestaurantCard({ restaurant, onCardClick }) {
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useIsMobile();

  const handleDirections = (e) => {
    e.stopPropagation();
    
    if (!restaurant.coordinates) {
      console.error('No coordinates available for directions');
      return;
    }

    const { lat, lng } = restaurant.coordinates;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    if (isMobile) {
      // On mobile, open in the same window (will trigger Google Maps app if installed)
      window.location.href = mapsUrl;
    } else {
      // On desktop, open in a new tab
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200"
      onClick={() => onCardClick?.(restaurant)}
      data-testid={`card-restaurant-${restaurant.id}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 backdrop-blur-sm bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
            console.log(isSaved ? 'Unsaved' : 'Saved', restaurant.name);
          }}
          data-testid={`button-save-${restaurant.id}`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold line-clamp-1" data-testid={`text-restaurant-name-${restaurant.id}`}>
            {restaurant.name}
          </h3>
          {restaurant.isOpen && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Open now
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(restaurant.rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            {restaurant.rating} ({restaurant.reviewCount})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisine.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="text-chart-2 font-medium">
            {'$'.repeat(restaurant.priceLevel)}
          </span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{restaurant.distance}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {restaurant.phone && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
            data-testid={`button-call-${restaurant.id}`}
          >
            <a 
              href={`tel:${restaurant.phone}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </a>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleDirections}
          data-testid={`button-directions-${restaurant.id}`}
        >
          <MapPin className="h-3 w-3 mr-1" />
          Directions
        </Button>
      </CardFooter>
    </Card>
  );
}
