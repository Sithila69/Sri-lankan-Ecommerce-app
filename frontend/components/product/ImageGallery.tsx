"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";

interface Image {
  image_url: string;
  alt_text?: string;
}

const ImageGallery: React.FC<{ images: Image[] }> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-2xl">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="relative group">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image
          src={images[selectedIndex].image_url}
          alt={images[selectedIndex].alt_text || "Product image"}
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? "scale-110 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          quality={100}
        />

        {/* Zoom indicator */}
        <button
          className={`absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md transition-opacity ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
          }}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-md">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
