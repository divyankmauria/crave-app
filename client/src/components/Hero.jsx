import heroImage from '@assets/generated_images/Diverse_appetizing_food_hero_banner_b52cf140.png';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Hero({ onGetStarted }) {
  return (
    <div className="relative h-96 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-heading">
          Discover Your Next<br />Favorite Meal
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl">
          Search for any food and find the best restaurants, cafes, and eateries near you
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8"
          onClick={onGetStarted}
          data-testid="button-get-started"
        >
          <Search className="mr-2 h-5 w-5" />
          Start Searching
        </Button>
      </div>
    </div>
  );
}
