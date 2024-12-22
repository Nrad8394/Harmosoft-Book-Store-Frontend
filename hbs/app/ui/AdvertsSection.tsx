"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Advert {
  id: string;
  title: string;
  image: string | null;
}

interface AdvertsSectionProps {
  adverts: Advert[];
}

const AdvertsSection: React.FC<AdvertsSectionProps> = ({ adverts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalAdverts = adverts.length;

  // Auto-cycle through adverts every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextAdvert();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const nextAdvert = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalAdverts);
  };

  const prevAdvert = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalAdverts) % totalAdverts
    );
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handlePlay = () => {
    setIsPaused(false);
  };

  // Select two random small adverts excluding the current large advert
  const smallAdverts = adverts
    .filter((_, index) => index !== currentIndex)
    .slice(0, 2);

  const renderProgressDots = () => {
    return (
      <div className="flex justify-center space-x-1 mt-2">
        {adverts.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full ${
              idx === currentIndex ? "bg-green-700" : "bg-gray-300"
            } transition-colors duration-500`}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center m-auto w-full md:w-9/10 h-full">
      {/* Large Advert Card */}
      {adverts[currentIndex] && (
        <div
          key={adverts[currentIndex].id}
          className="relative w-full border border-gray-300 shadow-lg rounded-md mb-4 overflow-hidden w-full"
          onMouseEnter={handlePause}
          onMouseLeave={handlePlay}
        >
          <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <Image
              src={adverts[currentIndex].image || "/assets/default-advert.png"}
              alt={adverts[currentIndex].title || "Advert image"}
              layout="fill"
              objectFit="cover" // Ensures the image covers the container without stretching
              placeholder="blur"
              blurDataURL="/assets/default-advert.png"
            />
           {/* Overlay with arrows */}
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <button
                onClick={prevAdvert}
                className="p-2 bg-gray-700 bg-opacity-50 text-white rounded-full hover:bg-gray-900"
                aria-label="Previous Advert"
              >
                <FaArrowLeft aria-hidden="true" />
              </button>
              <button
                onClick={nextAdvert}
                className="p-2 bg-gray-700 bg-opacity-50 text-white rounded-full hover:bg-gray-900"
                aria-label="Next Advert"
              >
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>

            {/* Title Overlay */}
            {/* <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-2">
              <h3 className="text-md font-semibold">
                {adverts[currentIndex].title || "Advert Title"}
              </h3>
            </div> */}
          </div>
          {renderProgressDots()}
        </div>
      )}

      {/* Two Smaller Advert Cards */}
      <div className="flex flex-col md:flex-row w-full gap-4 justify-between mt-5">
        {smallAdverts.map((advert) => (
          <div
            key={advert.id}
            className="flex-1 border border-gray-300 shadow-lg rounded-md overflow-hidden"
          >
            <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <Image
                src={advert.image || "/assets/default-advert.png"}
                alt={advert.title || "Advert image"}
                layout="fill"
                objectFit="cover" // Ensures the image covers the container without stretching
                placeholder="blur"
                blurDataURL="/assets/default-advert.png"
              />
              {/* Title Overlay */}
              {/* <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-1">
                <h3 className="text-sm font-semibold">
                  {advert.title || "Advert Title"}
                </h3>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvertsSection;
