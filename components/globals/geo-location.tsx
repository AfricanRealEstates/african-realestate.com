"use client";
import React, { useEffect, useState } from "react";
export default function Geolocation() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleSuccess = ({
    coords: { latitude, longitude },
  }: {
    coords: { latitude: number; longitude: number };
  }) => {
    setLatitude(latitude);
    setLongitude(longitude);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess);
    }
  }, []);

  return (
    <div>
      <h1>Geolocation:</h1>
      <div>Latitude: {latitude}</div>
      <div>Longitude: {longitude}</div>
    </div>
  );
}
