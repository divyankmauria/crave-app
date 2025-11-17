import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function FilterPanel({ isOpen, onClose, onApplyFilters }) {
  const [distance, setDistance] = useState([5]);
  const [priceLevel, setPriceLevel] = useState([1, 2, 3, 4]);
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [cuisines, setCuisines] = useState([]);

  const cuisineTypes = [
    'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian',
    'Thai', 'American', 'French', 'Korean', 'Mediterranean'
  ];

  const toggleCuisine = (cuisine) => {
    setCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50" onClick={onClose}>
      <div 
        className="h-full w-full max-w-md bg-background border-l shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold font-heading">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-filters">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Distance: {distance[0]} miles</Label>
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={25}
                min={1}
                step={1}
                className="mt-2"
                data-testid="slider-distance"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Price Level</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((level) => (
                  <Button
                    key={level}
                    variant={priceLevel.includes(level) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setPriceLevel(prev =>
                        prev.includes(level)
                          ? prev.filter(p => p !== level)
                          : [...prev, level]
                      );
                    }}
                    className="flex-1"
                    data-testid={`button-price-${level}`}
                  >
                    {'$'.repeat(level)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Minimum Rating</Label>
              <div className="flex gap-2">
                {[0, 3, 4].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinRating(rating)}
                    className="flex-1"
                    data-testid={`button-rating-${rating}`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="open-now" className="text-base font-medium">Open Now</Label>
              <Switch
                id="open-now"
                checked={openNow}
                onCheckedChange={setOpenNow}
                data-testid="switch-open-now"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Cuisine Type</Label>
              <div className="space-y-3">
                {cuisineTypes.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={cuisines.includes(cuisine)}
                      onCheckedChange={() => toggleCuisine(cuisine)}
                      data-testid={`checkbox-cuisine-${cuisine.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={cuisine}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setDistance([5]);
              setPriceLevel([1, 2, 3, 4]);
              setOpenNow(false);
              setMinRating(0);
              setCuisines([]);
            }}
            data-testid="button-clear-filters"
          >
            Clear All
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              const radiusInMeters = distance[0] * 1609.34;
              onApplyFilters?.({
                radius: radiusInMeters,
                price: priceLevel,
                openNow,
                minRating,
              });
              console.log('Apply filters:', { distance, priceLevel, openNow, minRating, cuisines });
              onClose();
            }}
            data-testid="button-apply-filters"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
