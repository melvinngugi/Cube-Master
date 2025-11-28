import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TrainerHeader from "../components/TrainerHeader";
import AlgorithmCard from "../components/AlgorithmCard";
import RightSidebar from "../components/RightSidebar";
import notationImage from "../images/notation.png";

export default function Trainer() {
  const [twoLookOll, setTwoLookOll] = useState([]);
  const [twoLookPll, setTwoLookPll] = useState([]);
  const [oll, setOll] = useState([]);
  const [pll, setPll] = useState([]);

  useEffect(() => {
    fetch("/api/v1/algorithms?category=2LOOK_OLL")
      .then(res => res.json())
      .then(data => setTwoLookOll(data));

    fetch("/api/v1/algorithms?category=2LOOK_PLL")
      .then(res => res.json())
      .then(data => setTwoLookPll(data));

    fetch("/api/v1/algorithms?category=OLL")
      .then(res => res.json())
      .then(data => setOll(data));

    fetch("/api/v1/algorithms?category=PLL")
      .then(res => res.json())
      .then(data => setPll(data));
  }, []);

  const renderCards = (algos) =>
    algos.map(({ ALGORITHM_ID, NAME, MOVE_SEQUENCE }) => (
      <AlgorithmCard
        key={ALGORITHM_ID}
        imageSrc={`/src/images/${ALGORITHM_ID}.png`}
        name={NAME}
        algorithm={MOVE_SEQUENCE}
      />
    ));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TrainerHeader />
        <div className="p-6 overflow-y-auto">
          <img
            src={notationImage}
            alt="Notation Guide"
            className="w-full max-w-4xl mx-auto mb-8 rounded-lg shadow"
          />

          {/* Sections in order */}
          <section id="two-look-oll" className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2-Look OLL</h2>
            <div className="flex flex-col space-y-4">{renderCards(twoLookOll)}</div>
          </section>

          <section id="two-look-pll" className="mb-10">
            <h2 className="text-xl font-semibold mb-4">2-Look PLL</h2>
            <div className="flex flex-col space-y-4">{renderCards(twoLookPll)}</div>
          </section>

          <section id="oll" className="mb-10">
            <h2 className="text-xl font-semibold mb-4">OLL</h2>
            <div className="flex flex-col space-y-4">{renderCards(oll)}</div>
          </section>

          <section id="pll" className="mb-10">
            <h2 className="text-xl font-semibold mb-4">PLL</h2>
            <div className="flex flex-col space-y-4">{renderCards(pll)}</div>
          </section>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
