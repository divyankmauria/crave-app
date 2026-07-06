# Crave

Crave is a restaurant discovery web app that helps users find nearby places for the food they are craving. It combines a React/Vite frontend with an Express API that searches restaurants through Yelp and displays results in list or map views.

## Features

- Search restaurants by food, cuisine, or craving
- Use browser geolocation with a New York City fallback
- Filter by distance, price, open-now status, and minimum rating
- Sort results by distance or rating
- Toggle between list and Google Maps views
- Fetch restaurant data from the Yelp Fusion API

## Tech Stack

- React 18
- Vite
- Express
- TanStack Query
- Wouter
- Tailwind CSS
- Radix UI components
- Google Maps JavaScript API
- Yelp Fusion API

## Getting Started

Install dependencies:

```sh
npm install
```

Create a local environment file from the example:

```sh
cp .env.example .env
```

Fill in the required API keys:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
YELP_API_KEY=your_yelp_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Start the development server:

```sh
npm run dev
```

By default, the app runs on port `5000`.

## Scripts

```sh
npm run dev
```

Runs the Express server in development mode with Vite middleware.

```sh
npm run build
```

Builds the Vite frontend and bundles the Express server into `dist`.

```sh
npm start
```

Runs the production server from `dist/index.js`.

```sh
npm run db:push
```

Runs Drizzle Kit schema push.

## Project Structure

```text
client/
  src/
    components/   React UI components
    hooks/        Shared React hooks
    lib/          Client utilities and query setup
    pages/        App pages
server/
  index.js        Express server entry point
  routes.js       API routes for config and restaurant search
  vite.js         Vite dev/prod serving helpers
shared/
  schema.js       Shared validation schemas
```

## API Routes

`GET /api/config`

Returns frontend configuration, including the Google Maps API key.

`POST /api/search`

Searches Yelp for restaurants using the provided search term, location, radius, price, open-now flag, and rating filters.

## Notes

- The app requires a valid `YELP_API_KEY` for restaurant search.
- The map view requires a valid `GOOGLE_MAPS_API_KEY`.
- Browser location access is optional; if denied, the app falls back to New York City.
