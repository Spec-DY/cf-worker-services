import getExternalWeatherData from "@/lib/get_external_weather_data";

// edge mode is not support by cloudflare yet
// export const runtime = "edge";

const countries = [
  {
    country: "london",
    title: "London, UK",
    lat: 51.50853,
    long: -0.12574,
  },
  {
    country: "new-york",
    title: "New York, US",
    lat: 40.71427,
    long: -74.00597,
  },
  {
    country: "los-angeles",
    title: "Los Angeles, US",
    lat: 34.05223,
    long: -118.24368,
  },
  {
    country: "burnaby",
    title: "Evergreen Place, Canada",
    lat: 49.2534,
    long: -122.9373,
  },
  {
    country: "wuhan",
    title: "武汉中南, 中国",
    lat: 30.5383,
    long: 114.335,
  },
];

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  const cache = getCloudflareContext().env.WEATHER_CACHE;

  const request_url = new URL(request.url);
  const requested_country = request_url.searchParams.get("country");
  const country_config = countries.find((c) => c.country == requested_country);

  if (!country_config) {
    return new Response("Not found", { status: 404 });
  }

  const cached_data = await cache.get(`location:${requested_country}`);

  let weather_data;

  if (!cached_data) {
    console.log("No cached data found");

    weather_data = await getExternalWeatherData(
      country_config.lat,
      country_config.long
    );

    // put weather data as value, location:country as key
    await cache.put(
      `location:${requested_country}`,
      JSON.stringify(weather_data),
      { expirationTtl: 3600 } // expire after 1 hour
    );
  } else {
    console.log("cached data found");
    weather_data = JSON.parse(cached_data);
  }

  const response = {
    temperature_celsius: weather_data.temperature_celsius,
    windspeed_kph: weather_data.windspeed_kph,
    title: country_config.title,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
