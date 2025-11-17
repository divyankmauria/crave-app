import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp } from "lucide-react";

export default function SearchSuggestions({ onSuggestionClick }) {
  const popularSearches = [
    { icon: '🍕', text: 'Pizza' },
    { icon: '🍔', text: 'Burgers' },
    { icon: '🍜', text: 'Ramen' },
    { icon: '🍣', text: 'Sushi' },
    { icon: '🌮', text: 'Tacos' },
    { icon: '🍝', text: 'Pasta' },
  ];

  const trendingNow = ['Poke Bowls', 'Korean BBQ', 'Bubble Tea', 'Acai Bowls'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Popular Searches</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularSearches.map((item) => (
              <button
                key={item.text}
                onClick={() => onSuggestionClick(item.text)}
                className="flex items-center gap-2 p-3 rounded-md border bg-card hover-elevate active-elevate-2 transition-all text-left"
                data-testid={`button-search-${item.text.toLowerCase()}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-chart-2" />
            <h3 className="text-lg font-semibold">Trending Now</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingNow.map((trend) => (
              <Badge
                key={trend}
                variant="secondary"
                className="cursor-pointer hover-elevate active-elevate-2 px-4 py-2"
                onClick={() => onSuggestionClick(trend)}
                data-testid={`badge-trending-${trend.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {trend}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
