import { createServer } from "http";
import { searchRestaurantsSchema } from "../shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app) {
  app.get("/api/config", (_req, res) => {
    res.json({
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    });
  });

  app.post("/api/search", async (req, res) => {
    try {
      const validatedData = searchRestaurantsSchema.parse(req.body);
      
      const yelpApiKey = process.env.YELP_API_KEY;
      if (!yelpApiKey) {
        return res.status(500).json({ error: "Yelp API key not configured" });
      }

      const params = new URLSearchParams({
        term: validatedData.term,
        limit: '20',
      });

      if (validatedData.latitude && validatedData.longitude) {
        params.append('latitude', validatedData.latitude.toString());
        params.append('longitude', validatedData.longitude.toString());
      } else if (validatedData.location) {
        params.append('location', validatedData.location);
      } else {
        params.append('location', 'New York, NY');
      }

      if (validatedData.radius) {
        params.append('radius', Math.min(validatedData.radius, 40000).toString());
      }

      if (validatedData.price && validatedData.price.length > 0) {
        params.append('price', validatedData.price.join(','));
      }

      if (validatedData.openNow) {
        params.append('open_now', 'true');
      }

      const response = await fetch(
        `https://api.yelp.com/v3/businesses/search?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${yelpApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Yelp API error:', errorText);
        return res.status(response.status).json({ 
          error: 'Failed to fetch from Yelp API',
          details: errorText 
        });
      }

      const data = await response.json();
      let businesses = data.businesses || [];

      if (validatedData.minRating && validatedData.minRating > 0) {
        businesses = businesses.filter(business => business.rating >= validatedData.minRating);
      }

      const restaurants = businesses.map((business) => ({
        id: business.id,
        name: business.name,
        image: business.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        rating: business.rating,
        reviewCount: business.review_count,
        priceLevel: business.price ? business.price.length : 2,
        cuisine: business.categories.map(cat => cat.title),
        distance: business.distance 
          ? `${(business.distance / 1609.34).toFixed(1)} mi`
          : 'N/A',
        address: `${business.location.address1}, ${business.location.city}, ${business.location.state}`,
        phone: business.display_phone,
        isOpen: business.is_closed === false,
        coordinates: {
          lat: business.coordinates.latitude,
          lng: business.coordinates.longitude,
        },
      }));

      res.json({ restaurants });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
