import React, { useEffect, useState } from "react";

export default function AlgorithmCard({
  imageSrc,
  name,
  algorithm,
  userId,
  algorithmId,
  initialStatus,
  onStatusChange,
}) {
  const [status, setStatus] = useState(initialStatus || "NONE");

  useEffect(() => {
    setStatus(initialStatus || "NONE");
  }, [initialStatus]);

  const cycleStatus = async () => {
    if (!userId) {
      console.warn("No userId available; are you logged in?");
      return;
    }

    const next =
      status === "NONE" ? "LEARNING" : status === "LEARNING" ? "LEARNED" : "NONE";

    setStatus(next);

    try {
      const res = await fetch("/api/v1/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, algorithmId, status: next }),
      });

      if (!res.ok) {
        console.error("Failed to save progress:", await res.text());
        setStatus(status);
        return;
      }

      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Network error while saving progress:", err);
      setStatus(status);
    }
  };

  const getBgColor = () => {
    if (status === "LEARNING") return "bg-yellow-200";
    if (status === "LEARNED") return "bg-green-200";
    return "bg-white";
  };

  return (
    <div
      onClick={cycleStatus}
      className={`flex rounded-lg shadow-md p-4 cursor-pointer transition-colors ${getBgColor()}`}
    >
      <img
        src={imageSrc}
        alt={`Algorithm ${name}`}
        className="w-24 h-24 object-contain mr-4"
      />
      <div className="flex flex-col justify-center flex-1 text-center">
        <h3 className="text-base font-semibold text-gray-800">{name}</h3>
        <p className="text-sm font-mono text-gray-600 mt-3">{algorithm}</p>
      </div>
    </div>
  );
}
