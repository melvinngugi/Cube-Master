import React from "react";

export default function ProgressBar({ label, total, learningCount, learnedCount }) {
  const percentLearning = (learningCount / total) * 100;
  const percentLearned = (learnedCount / total) * 100;

  return (
    <div className="mb-4">
      <p className="font-semibold mb-1">{label}</p>
      <div className="w-full h-6 bg-gray-300 rounded flex">
        <div
          className="bg-yellow-400 h-6"
          style={{ width: `${percentLearning}%` }}
        />
        <div
          className="bg-green-500 h-6"
          style={{ width: `${percentLearned}%` }}
        />
      </div>
      <p className="text-sm mt-1">
        Learning: {learningCount} | Learned: {learnedCount} / {total}
      </p>
    </div>
  );
}
