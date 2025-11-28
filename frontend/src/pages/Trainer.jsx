import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TrainerHeader from "../components/TrainerHeader";
import AlgorithmCard from "../components/AlgorithmCard";
import notationImage from "../images/notation.png";

export default function Trainer() {
  const [ollAlgorithms, setOllAlgorithms] = useState([]);
  const [pllAlgorithms, setPllAlgorithms] = useState([]);

  useEffect(() => {
    fetch("/api/v1/algorithms?category=OLL")
      .then(res => res.json())
      .then(data => setOllAlgorithms(data));

    fetch("/api/v1/algorithms?category=PLL")
      .then(res => res.json())
      .then(data => setPllAlgorithms(data));
  }, []);

  const renderCards = (algos) =>
    algos.map(({ ALGORITHM_ID, MOVE_SEQUENCE }) => (
      <AlgorithmCard
        key={ALGORITHM_ID}
        imageSrc={`/src/images/${ALGORITHM_ID}.png`}
        algorithm={MOVE_SEQUENCE}
      />
    ));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TrainerHeader />

        <div className="p-6 overflow-y-auto">
          {/* Notation banner */}
          <img
            src={notationImage}
            alt="Notation Guide"
            className="w-full max-w-4xl mx-auto mb-8 rounded-lg shadow"
          />

          {/* OLL Section */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">OLL Algorithms</h2>
            <div className="flex flex-wrap">{renderCards(ollAlgorithms)}</div>
          </section>

          {/* PLL Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">PLL Algorithms</h2>
            <div className="flex flex-wrap">{renderCards(pllAlgorithms)}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
