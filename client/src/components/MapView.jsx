import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function MapView({ restaurants, center, onMarkerClick }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={restaurant.coordinates}
          onClick={() => {
            setSelectedRestaurant(restaurant);
            onMarkerClick?.(restaurant);
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#e95a5f',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedRestaurant && (
        <InfoWindow
          position={selectedRestaurant.coordinates}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <Card className="border-0 shadow-none max-w-xs">
            <CardContent className="p-0">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-32 object-cover rounded-t-md"
              />
              <div className="p-3">
                <h3 className="font-semibold text-base mb-1">{selectedRestaurant.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-sm">{selectedRestaurant.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({selectedRestaurant.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-chart-2 font-medium">
                    {'$'.repeat(selectedRestaurant.priceLevel)}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedRestaurant.distance}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
