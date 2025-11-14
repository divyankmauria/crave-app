import { useState, useEffect } from "react";
import { LoadScript } from '@react-google-maps/api';
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchSuggestions from "@/components/SearchSuggestions";
import RestaurantCard from "@/components/RestaurantCard";
import MapView from "@/components/MapView";
import FilterPanel from "@/components/FilterPanel";
import ViewToggle from "@/components/ViewToggle";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('list');
  const [showResults, setShowResults] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filters, setFilters] = useState({
    radius: 8000,
    price: [1, 2, 3, 4],
    openNow: false,
    minRating: 0,
  });
  const { toast } = useToast();

  const { data: config } = useQuery({
    queryKey: ['/api/config'],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Got user location:', location);
          setUserLocation(location);
        },
        (error) => {
          console.log('Location access denied, using NYC fallback:', error);
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      console.log('Geolocation not supported, using NYC fallback');
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  console.log('Query state:', { showResults, searchQuery, userLocation, filters, enabled: showResults && !!searchQuery && !!userLocation });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/search', searchQuery, userLocation, filters],
    enabled: showResults && !!searchQuery && !!userLocation,
    retry: 1,
  });

  console.log('Query result:', { data, isLoading, isError, error });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowResults(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowResults(true);
  };

  const handleGetStarted = () => {
    const searchInput = document.querySelector('[data-testid="input-search"]');
    searchInput?.focus();
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const restaurants = data?.restaurants || [];
  
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === 'distance') {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
      return distanceA - distanceB;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });
  
  const mapCenter = userLocation || { lat: 40.7128, lng: -74.006 };

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch restaurants. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        onFilterClick={() => setShowFilters(true)}
      />

      {!showResults ? (
        <>
          <Hero onGetStarted={handleGetStarted} />
          <SearchSuggestions onSuggestionClick={handleSuggestionClick} />
        </>
      ) : (
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold font-heading">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isLoading ? 'Searching...' : `${restaurants.length} restaurants found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {view === 'list' && restaurants.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="w-32" data-testid="select-sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : view === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onCardClick={(r) => console.log('Restaurant clicked:', r.name)}
                />
              ))}
            </div>
          ) : (
            <div className="h-[calc(100vh-16rem)] rounded-md overflow-hidden border">
              {config?.googleMapsApiKey && (
                <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
                  <MapView
                    restaurants={sortedRestaurants}
                    center={mapCenter}
                    onMarkerClick={(r) => console.log('Marker clicked:', r.name)}
                  />
                </LoadScript>
              )}
            </div>
          )}
        </div>
      )}

      <FilterPanel 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
