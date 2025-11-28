// src/components/AlgorithmCard.jsx
import React from "react";

export default function AlgorithmCard({ imageSrc, name, algorithm }) {
  return (
    <div className="flex bg-white rounded-lg shadow-md p-4 m-2 w-full max-w-md">
      {/* Image on the left */}
      <img
        src={imageSrc}
        alt={`Algorithm ${name}`}
        className="w-24 h-24 object-contain mr-4"
      />

      {/* Centered text block */}
      <div className="flex flex-col justify-center flex-1 text-center">
        <h3 className="text-base font-semibold text-gray-800">{name}</h3>
        <p className="text-sm font-mono text-gray-600 mt-3">{algorithm}</p>
      </div>
    </div>
  );
}
