import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-md">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex-1"
        data-testid="button-view-list"
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button
        variant={view === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('map')}
        className="flex-1"
        data-testid="button-view-map"
      >
        <Map className="h-4 w-4 mr-2" />
        Map
      </Button>
    </div>
  );
}
