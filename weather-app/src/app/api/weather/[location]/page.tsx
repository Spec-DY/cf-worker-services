"use client";

import { WeatherInfo } from "@/app/components/WeatherInfo";
import { useEffect, useState, use } from "react";
import Link from "next/link";

type Weather = {
  location: String;
  temperature: Number;
  windspeed: Number;
};

type WeatherApiResponse = {
  title: String;
  temperature_celsius: Number;
  windspeed_kph: Number;
};

export const runtime = "edge";

export default function Page({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = use(params);

  const [weatherData, setWeatherData] = useState<Weather | null>(null);

  useEffect(() => {
    fetch(`/api/weather?country=${location}`)
      .then((response) => response.json<WeatherApiResponse>())
      .then((response) =>
        setWeatherData({
          location: response.title,
          temperature: response.temperature_celsius,
          windspeed: response.windspeed_kph,
        })
      );
  }, [location]);

  return (
    <>
      {weatherData && (
        <>
          <div id="weather-info">
            <WeatherInfo
              location={weatherData.location}
              temperature={weatherData.temperature}
              windspeed={weatherData.windspeed}
            />
          </div>
          <Link href="/" className="border-2 p-0.5 rounded-md shadow-md">
            Back
          </Link>
        </>
      )}

      {!weatherData && (
        <div>
          <h3 id="loading-text">Loading...</h3>
        </div>
      )}
    </>
  );
}
