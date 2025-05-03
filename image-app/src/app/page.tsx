"use client";

import React from "react";
import { ChangeEvent } from "react";
import { ImageList } from "@/components/ImageList";

// add types for the images
type UserImage = {
  url: string;
  filename: string;
  permanentUrl?: string;
};

interface ApiResponse {
  success: boolean;
  images: { url: string; filename: string }[];
}

export default function Home() {
  const [uploadedImages, setUploadedImages] = React.useState<Array<UserImage>>(
    []
  );
  const [isUploading, setIsUploading] = React.useState(false);

  const handleChange = (event: ChangeEvent) => {
    const local_files = (event.target as HTMLInputElement).files;
    let localUploadedImages: Array<UserImage> = [];

    if (local_files == undefined || local_files.length === 0) {
      return;
    }

    setIsUploading(true);
    let formData = new FormData();

    for (let x = 0; x < local_files.length; x++) {
      formData.append("files", local_files[x]);

      localUploadedImages.push({
        url: URL.createObjectURL(local_files[x]),
        filename: local_files[x].name,
      });
    }

    fetch("/api/files", { body: formData, method: "post" })
      .then((response) => response.json())
      .then((data) => {
        if ((data as ApiResponse).success) {
          // use the localUploadedImages to set the state
          // and add the permanent URL to each image
          const images = localUploadedImages.map((img, i) => ({
            ...img,
            permanentUrl: (data as ApiResponse).images[i].url,
          }));
          setUploadedImages(images);
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // copy the permanent URL to clipboard
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => alert("URL Copied!"));
  };

  return (
    <section className="h-screen">
      <div className="container py-5 h-full mx-auto">
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="mb-4 font-bold text-3xl items-center w-auto">
            Image Host
          </h1>
          <a
            href="/uploadedimages"
            className="border-2 border-blue-500 p-2 rounded-2xl shadow-md cursor-pointer hover:bg-blue-800 bg-blue-500 text-white transition-colors"
          >
            Uploaded Images
          </a>
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-4 mt-6 flex flex-col items-center">
            {/* {uploadedImages.length === 0 && ( */}
            <>
              <label
                htmlFor="upload-image"
                className="w-full p-2 border rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-200 shadow-md"
              >
                Upload images and get permanent URLs
              </label>
              <input
                id="upload-image"
                className="w-0 h-0"
                aria-label="Images"
                type="file"
                multiple
                onChange={handleChange}
                disabled={isUploading}
              />

              {isUploading && <p className="text-center">Uploading...</p>}
            </>
            {/* )} */}

            {uploadedImages.length > 0 && (
              <>
                <p className="text-center">Files uploaded successfully.</p>

                <ImageList images={uploadedImages} />

                {/* display URL */}
                <div className=" border rounded p-4 mt-6">
                  <h4 className="font-medium mb-2">URL:</h4>
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="mb-2 flex items-center">
                      <div className="truncate flex-1">
                        {image.permanentUrl}
                      </div>
                      <button
                        onClick={() => copyUrl(image.permanentUrl || "")}
                        className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm shadow-md transition-colors hover:bg-blue-800"
                      >
                        copy
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setUploadedImages([])}
                    className="bg-blue-500 px-4 py-2 rounded-xl text-white shadow-md hover:bg-blue-800 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
