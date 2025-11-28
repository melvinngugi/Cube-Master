import React from "react";

export default function AlgorithmCard({ imageSrc, algorithm }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 m-2 w-40">
      <img
        src={imageSrc}
        alt="Algorithm visual"
        className="w-full h-auto mb-2 rounded"
      />
      <p className="text-sm text-center font-mono">{algorithm}</p>
    </div>
  );
}
