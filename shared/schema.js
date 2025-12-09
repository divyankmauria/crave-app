import { z } from "zod";

export const searchRestaurantsSchema = z.object({
  term: z.string().min(1, "Search term is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
  radius: z.number().max(40000).optional(),
  price: z.array(z.number().min(1).max(4)).optional(),
  openNow: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
});
