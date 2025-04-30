"use client";

import React from "react";
import { ChangeEvent } from "react";
import { ImageList } from "@/components/ImageList";

export default function Home() {
  const handleChange = (event: ChangeEvent) => {
    const local_files = (event.target as HTMLInputElement).files;
    let localUploadedImages: Array<UserImage> = [];

    if (local_files == undefined || local_files.length === 0) {
      return;
    }

    let formData = new FormData();

    for (let x = 0; x < local_files.length; x++) {
      // append each picture to formData
      // which will post to R2 later
      formData.append("files", local_files[x]);

      // the formData will look like:
      // FormData {
      //   "files": [
      //     File {
      //       name: "cat.jpg",
      //       type: "image/jpeg",
      //       size: 1234567,
      //       lastModified: 1618412345678
      //     },
      //     File {
      //       name: "dog.png",
      //       type: "image/png",
      //       size: 2345678,
      //       lastModified: 1618412345679
      //     }
      //   ]
      // }

      // and also save it to localUploadedImages
      // so it will be displayed after post to R2
      localUploadedImages.push({
        url: URL.createObjectURL(local_files[x]),
        filename: local_files[x].name,
      });
    }

    const headers = {
      "content-type": "multipart/form-data",
    };

    fetch("/api/files", { body: formData, method: "post" }).then((response) => {
      if (response.ok) {
        setUploadedImages(localUploadedImages);
      } else {
        // handle an error
      }
    });
  };

  const [uploadedImages, setUploadedImages] = React.useState(new Array());

  return (
    <section className="h-screen">
      <div className="container py-5 h-full mx-auto">
        <div className="flex justify-center items-center h-full">
          <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-4">
            <h3 className="mb-4 pb-2 font-normal text-center">
              AI Image Analyzer
            </h3>

            {uploadedImages.length === 0 && (
              <>
                <p>
                  Select a number of images and upload them to have them
                  analyzed.
                </p>

                <div className="rounded mb-3">
                  <input
                    className="w-full p-2 border rounded"
                    aria-label="Images"
                    type="file"
                    multiple
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {uploadedImages.length > 0 && (
              <>
                <p className="text-center">Files uploaded successfully.</p>

                <ImageList images={uploadedImages} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
