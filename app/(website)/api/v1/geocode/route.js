import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    // Try to geocode with OpenStreetMap Nominatim
    const encodedLocation = encodeURIComponent(location);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodedLocation}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MumbaiMap/1.0'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Geocoding API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      // Try fallback coordinates for common Mumbai locations
      const fallbackCoords = getFallbackCoordinates(location);
      if (fallbackCoords) {
        return NextResponse.json(fallbackCoords);
      }
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    const result = {
      lat: parseFloat(data[0].lat),
      long: parseFloat(data[0].lon),
      display_name: data[0].display_name
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    );
  }
}

// Fallback coordinates for common Mumbai locations
function getFallbackCoordinates(location) {
  const fallbackMap = {
    'mumbai': { lat: 19.0760, long: 72.8777 },
    'mumbai city': { lat: 19.0760, long: 72.8777 },
    'colaba': { lat: 18.9067, long: 72.8144 },
    'bandra': { lat: 19.0544, long: 72.8398 },
    'andheri': { lat: 19.1136, long: 72.8697 },
    'borivali': { lat: 19.2306, long: 72.8561 },
    'dadar': { lat: 19.0181, long: 72.8434 },
    'worli': { lat: 19.0169, long: 72.8150 },
    'juhu': { lat: 19.1075, long: 72.8282 },
    'powai': { lat: 19.1176, long: 72.9060 },
    'navi mumbai': { lat: 19.0330, long: 73.0290 },
    'thane': { lat: 19.2183, long: 72.9781 },
    'vasai': { lat: 19.3919, long: 72.8398 },
    'virar': { lat: 19.4553, long: 72.8154 },
    'vasai-virar': { lat: 19.4236, long: 72.8276 }
  };

  const normalizedLocation = location.toLowerCase().trim();
  
  // Check exact match
  if (fallbackMap[normalizedLocation]) {
    return fallbackMap[normalizedLocation];
  }

  // Check partial match
  for (const [key, coords] of Object.entries(fallbackMap)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return coords;
    }
  }

  // Default to Mumbai center
  return { lat: 19.0760, long: 72.8777 };
}