"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CityCard from "./CityCard";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1324, min: 764 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 764, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export const cities = [
  {
    id: 6,
    image: "/assets/nakasero.webp",
    cityName: "Nakasero",
    numberOfProperties: 2,
  },
  {
    id: 1,
    image: "/assets/house.jpg",
    cityName: "Ruiru",
    numberOfProperties: 120,
  },
  {
    id: 2,
    image: "/assets/house-1.jpg",
    cityName: "Kitengela",
    numberOfProperties: 80,
  },
  {
    id: 3,
    image: "/assets/Kilimani.webp",
    cityName: "Kilimani",
    numberOfProperties: 12,
  },
  {
    id: 4,
    image: "/assets/kitengela.webp",
    cityName: "Kitengela",
    numberOfProperties: 80,
  },
  {
    id: 5,
    image: "/assets/westland.webp",
    cityName: "Westlands",
    numberOfProperties: 24,
  },
];

export default function CitySlider() {
  return (
    <Carousel
      arrows={true}
      autoPlay={true}
      autoPlaySpeed={5000}
      infinite
      responsive={responsive}
      className="z-20"
    >
      {cities.map((city) => {
        return (
          <div key={city.id}>
            {/* CitySlider card */}
            <CityCard city={city} />
          </div>
        );
      })}
    </Carousel>
  );
}
