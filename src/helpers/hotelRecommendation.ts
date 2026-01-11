const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export const fetchNearbyHotels = async (lat: number, lng: number): Promise<GooglePlaceResult[]> => {
  if (!GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is missing");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=15000&type=lodging&key=${GOOGLE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status, data.error_message);
      return [];
    }

    return data.results;
  } catch (error) {
    console.error("Error fetching nearby hotels:", error);
    return [];
  }
};

export const getPhotoUrl = (photoReference: string | undefined): string => {
  if (!photoReference || !GOOGLE_API_KEY) {
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"; // Default fallback
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
};
