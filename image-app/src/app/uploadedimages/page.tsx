"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClearAllImagesButton } from "@/components/ClearAllImagesButton";

type UploadedImage = {
  key: string;
  url: string;
  uploaded: string;
  size: number;
};

interface ApiResponse {
  success: boolean;
  images: UploadedImage[];
}

export default function UploadedImages() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/getAllImages")
      .then((response) => response.json())
      .then((data) => {
        if ((data as ApiResponse).success) {
          setImages((data as ApiResponse).images);
        }
      })
      .catch((error) => console.error("Error fetching images:", error))
      .finally(() => setIsLoading(false));
  }, []);

  // copyUrl to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => alert("URL Copied!"));
  };

  const handleClearSuccess = () => {
    setImages([]);
  };

  return (
    <section className="h-screen">
      <div className="container py-5 h-full mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 font-bold text-3xl">Uploaded Images</h1>

          <Link
            href="/"
            className="border-2 border-blue-500 p-2 rounded-2xl shadow-md cursor-pointer hover:bg-blue-800 bg-blue-500 text-white mb-6"
          >
            Upload New Images
          </Link>

          <ClearAllImagesButton
            disabled={images.length === 0 || isLoading}
            onSuccess={handleClearSuccess}
          />

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : images.length === 0 ? (
            <p className="text-center">No images uploaded yet.</p>
          ) : (
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={image.url}
                      alt={`Image ${image.key}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center mb-2">
                        <div className="truncate flex-1 text-sm">
                          {image.url}
                        </div>
                        <button
                          onClick={() => copyUrl(image.url)}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          copy
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(image.uploaded).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
