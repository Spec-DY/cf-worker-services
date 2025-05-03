"use client";

import React, { useState } from "react";

interface ClearAllImagesButtonProps {
  disabled?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export const ClearAllImagesButton: React.FC<ClearAllImagesButtonProps> = ({
  disabled = false,
  onSuccess,
  className = "",
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const clearAllImages = async () => {
    interface ClearImagesResponse {
      success: boolean;
      message?: string;
    }

    if (window.confirm("Are you sure you want to delete all images?")) {
      setIsDeleting(true);

      try {
        const response = await fetch("/api/clearAllImages", {
          method: "DELETE",
        });

        const data = (await response.json()) as ClearImagesResponse;

        if (data.success) {
          alert(data.message || "All images deleted successfully!");

          // call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }
        } else {
          alert("Delete failed: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting images: " + error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  return (
    <button
      onClick={clearAllImages}
      disabled={isDeleting || disabled}
      className={`border-2 border-red-500 p-2 rounded-xl shadow-md cursor-pointer text-white
        ${
          isDeleting || disabled
            ? "bg-red-300 cursor-not-allowed"
            : "hover:bg-red-800 bg-red-500 transition-colors"
        }
        ${className}`}
    >
      {isDeleting ? "Deleting..." : "Delete All Images"}
    </button>
  );
};
