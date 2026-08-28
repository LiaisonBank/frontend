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

    // Geocode with OpenStreetMap Nominatim
    const encodedLocation = encodeURIComponent(location);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodedLocation}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MumbaiMap/1.0',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Geocoding API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // No fallback coordinates
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error: 'Location not found',
          location,
        },
        { status: 404 }
      );
    }

    const result = {
      lat: parseFloat(data[0].lat),
      long: parseFloat(data[0].lon),
      display_name: data[0].display_name,
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