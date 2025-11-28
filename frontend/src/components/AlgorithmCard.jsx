// src/components/AlgorithmCard.jsx
import React from "react";

export default function AlgorithmCard({ imageSrc, name, algorithm }) {
  return (
    <div className="flex items-start bg-white rounded-lg shadow-md p-4 m-2 w-full max-w-md">
      {/* Image on the left */}
      <img
        src={imageSrc}
        alt={`Algorithm ${name}`}
        className="w-24 h-24 object-contain mr-4"
      />

      {/* Text on the right */}
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm font-mono text-gray-600">{algorithm}</p>
      </div>
    </div>
  );
}
