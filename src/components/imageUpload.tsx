"use client";
import { useState } from "react";

const ImageUploader = ({ onUpload }: { onUpload: (images: File[]) => void }) => {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const newImages = [];
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024) {
        alert("You can't upload images larger than 1MB");
        continue;
      }
      newImages.push(file);
    }
    const updatedImages = [...images, ...newImages];

    setImages(updatedImages);
    onUpload(updatedImages);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        Click to upload images (max 1MB each)
      </label>
    </div>
  );
};

export default ImageUploader;
