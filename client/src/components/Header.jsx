import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header({ onSearchChange, onFilterClick, searchValue = "" }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent font-heading">
            Crave
          </h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you craving?"
              className="pl-9 pr-4"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          data-testid="button-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
