/**
 * Transport Routes - Air, Sea, and Land connections between countries
 * These define how the disease can spread internationally
 */

import type { TransportRoute } from "../types/game";

// Helper to create bidirectional routes
function createRoute(
  from: string,
  to: string,
  type: TransportRoute["type"],
  traffic: number,
): TransportRoute[] {
  const id = `${type}-${from}-${to}`;
  return [
    { id: `${id}-a`, type, from, to, traffic },
    { id: `${id}-b`, type, from: to, to: from, traffic },
  ];
}

// Major air routes (high traffic international flights)
const AIR_ROUTES: TransportRoute[] = [
  // North America hubs
  ...createRoute("usa", "uk", "air", 9),
  ...createRoute("usa", "france", "air", 8),
  ...createRoute("usa", "germany", "air", 8),
  ...createRoute("usa", "japan", "air", 9),
  ...createRoute("usa", "china", "air", 8),
  ...createRoute("usa", "canada", "air", 10),
  ...createRoute("usa", "mexico", "air", 10),
  ...createRoute("usa", "brazil", "air", 7),
  ...createRoute("usa", "australia", "air", 6),
  ...createRoute("canada", "uk", "air", 7),

  // Europe hubs
  ...createRoute("uk", "france", "air", 10),
  ...createRoute("uk", "germany", "air", 9),
  ...createRoute("uk", "spain", "air", 9),
  ...createRoute("uk", "italy", "air", 8),
  ...createRoute("france", "germany", "air", 9),
  ...createRoute("france", "spain", "air", 8),
  ...createRoute("france", "italy", "air", 8),
  ...createRoute("germany", "italy", "air", 8),
  ...createRoute("germany", "poland", "air", 7),
  ...createRoute("germany", "russia", "air", 6),
  ...createRoute("uk", "iceland", "air", 4),
  ...createRoute("norway", "iceland", "air", 3),
  ...createRoute("sweden", "norway", "air", 6),

  // Asia hubs
  ...createRoute("china", "japan", "air", 9),
  ...createRoute("china", "south_korea", "air", 9),
  ...createRoute("china", "thailand", "air", 8),
  ...createRoute("china", "india", "air", 7),
  ...createRoute("japan", "south_korea", "air", 8),
  ...createRoute("japan", "thailand", "air", 7),
  ...createRoute("india", "uk", "air", 8),
  ...createRoute("india", "saudi_arabia", "air", 8),
  ...createRoute("saudi_arabia", "egypt", "air", 7),
  ...createRoute("turkey", "germany", "air", 8),
  ...createRoute("turkey", "russia", "air", 6),

  // Oceania
  ...createRoute("australia", "new_zealand", "air", 8),
  ...createRoute("australia", "indonesia", "air", 7),
  ...createRoute("australia", "japan", "air", 6),
  ...createRoute("australia", "uk", "air", 5),

  // South America
  ...createRoute("brazil", "argentina", "air", 8),
  ...createRoute("brazil", "peru", "air", 6),
  ...createRoute("brazil", "colombia", "air", 6),
  ...createRoute("argentina", "peru", "air", 5),

  // Africa
  ...createRoute("egypt", "uk", "air", 6),
  ...createRoute("egypt", "france", "air", 6),
  ...createRoute("south_africa", "uk", "air", 6),
  ...createRoute("nigeria", "uk", "air", 5),
  ...createRoute("morocco", "france", "air", 7),
  ...createRoute("morocco", "spain", "air", 7),

  // Hard-to-reach islands (limited connections)
  ...createRoute("greenland", "iceland", "air", 2),
  ...createRoute("madagascar", "south_africa", "air", 3),
  ...createRoute("cuba", "mexico", "air", 5),
  ...createRoute("cuba", "usa", "air", 3),
  ...createRoute("philippines", "japan", "air", 6),
  ...createRoute("indonesia", "australia", "air", 6),
];

// Major sea routes (shipping lanes and ferries)
const SEA_ROUTES: TransportRoute[] = [
  // Atlantic
  ...createRoute("usa", "uk", "sea", 7),
  ...createRoute("usa", "france", "sea", 6),
  ...createRoute("brazil", "south_africa", "sea", 5),
  ...createRoute("brazil", "nigeria", "sea", 4),

  // European seas
  ...createRoute("uk", "france", "sea", 9),
  ...createRoute("uk", "norway", "sea", 6),
  ...createRoute("france", "spain", "sea", 7),
  ...createRoute("spain", "morocco", "sea", 8),
  ...createRoute("italy", "egypt", "sea", 6),
  ...createRoute("italy", "turkey", "sea", 5),
  ...createRoute("sweden", "poland", "sea", 7),
  ...createRoute("sweden", "germany", "sea", 6),

  // Asian seas
  ...createRoute("china", "japan", "sea", 8),
  ...createRoute("china", "south_korea", "sea", 9),
  ...createRoute("china", "vietnam", "sea", 7),
  ...createRoute("japan", "south_korea", "sea", 8),
  ...createRoute("india", "saudi_arabia", "sea", 6),
  ...createRoute("india", "indonesia", "sea", 5),
  ...createRoute("thailand", "vietnam", "sea", 6),
  ...createRoute("indonesia", "philippines", "sea", 5),

  // Pacific
  ...createRoute("australia", "indonesia", "sea", 6),
  ...createRoute("australia", "new_zealand", "sea", 7),
  ...createRoute("japan", "usa", "sea", 5),
  ...createRoute("china", "usa", "sea", 6),

  // Hard-to-reach (limited sea access)
  ...createRoute("greenland", "canada", "sea", 2),
  ...createRoute("iceland", "uk", "sea", 4),
  ...createRoute("iceland", "norway", "sea", 3),
  ...createRoute("madagascar", "south_africa", "sea", 4),
  ...createRoute("madagascar", "india", "sea", 3),
  ...createRoute("cuba", "mexico", "sea", 6),

  // Caribbean/Americas
  ...createRoute("usa", "cuba", "sea", 4),
  ...createRoute("mexico", "usa", "sea", 8),
  ...createRoute("colombia", "usa", "sea", 5),
  ...createRoute("peru", "mexico", "sea", 4),
];

// Land borders
const LAND_ROUTES: TransportRoute[] = [
  // North America
  ...createRoute("usa", "canada", "land", 10),
  ...createRoute("usa", "mexico", "land", 10),

  // South America
  ...createRoute("brazil", "argentina", "land", 8),
  ...createRoute("brazil", "peru", "land", 6),
  ...createRoute("brazil", "colombia", "land", 5),
  ...createRoute("argentina", "peru", "land", 5),
  ...createRoute("peru", "colombia", "land", 6),

  // Europe
  ...createRoute("france", "germany", "land", 10),
  ...createRoute("france", "spain", "land", 9),
  ...createRoute("france", "italy", "land", 9),
  ...createRoute("germany", "poland", "land", 9),
  ...createRoute("germany", "italy", "land", 7),
  ...createRoute("italy", "spain", "land", 6),
  ...createRoute("poland", "russia", "land", 7),
  ...createRoute("sweden", "norway", "land", 8),
  ...createRoute("russia", "china", "land", 6),

  // Asia
  ...createRoute("china", "india", "land", 5),
  ...createRoute("china", "pakistan", "land", 4),
  ...createRoute("china", "vietnam", "land", 6),
  ...createRoute("india", "pakistan", "land", 6),
  ...createRoute("thailand", "vietnam", "land", 6),
  ...createRoute("iran", "turkey", "land", 6),
  ...createRoute("iran", "pakistan", "land", 5),
  ...createRoute("turkey", "russia", "land", 4),
  ...createRoute("saudi_arabia", "egypt", "land", 5),

  // Africa
  ...createRoute("egypt", "morocco", "land", 3),
  ...createRoute("nigeria", "morocco", "land", 3),
  ...createRoute("south_africa", "nigeria", "land", 3),
];

// Combine all routes
export const TRANSPORT_ROUTES: TransportRoute[] = [
  ...AIR_ROUTES,
  ...SEA_ROUTES,
  ...LAND_ROUTES,
];

// Get routes by type
export function getRoutesByType(
  type: TransportRoute["type"],
): TransportRoute[] {
  return TRANSPORT_ROUTES.filter((r) => r.type === type);
}

// Get routes from a specific country
export function getRoutesFromCountry(countryId: string): TransportRoute[] {
  return TRANSPORT_ROUTES.filter((r) => r.from === countryId);
}

// Get routes to a specific country
export function getRoutesToCountry(countryId: string): TransportRoute[] {
  return TRANSPORT_ROUTES.filter((r) => r.to === countryId);
}

// Check if two countries are connected
export function areCountriesConnected(from: string, to: string): boolean {
  return TRANSPORT_ROUTES.some(
    (r) => (r.from === from && r.to === to) || (r.from === to && r.to === from),
  );
}
