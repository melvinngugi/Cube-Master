import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TrainerHeader from "../components/TrainerHeader";
import AlgorithmCard from "../components/AlgorithmCard";
import RightSidebar from "../components/RightSidebar";
import notationImage from "../images/notation.png";

export default function Trainer() {
  const [userId, setUserId] = useState(null);
  const [twoLookOll, setTwoLookOll] = useState([]);
  const [twoLookPll, setTwoLookPll] = useState([]);
  const [oll, setOll] = useState([]);
  const [pll, setPll] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/v1/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUserId(data.user.id))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/v1/algorithms?category=2LOOK_OLL")
      .then((res) => res.json())
      .then(setTwoLookOll);

    fetch("/api/v1/algorithms?category=2LOOK_PLL")
      .then((res) => res.json())
      .then(setTwoLookPll);

    fetch("/api/v1/algorithms?category=OLL")
      .then((res) => res.json())
      .then(setOll);

    fetch("/api/v1/algorithms?category=PLL")
      .then((res) => res.json())
      .then(setPll);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/v1/progress?userId=${userId}`)
        .then((res) => res.json())
        .then(setProgress);
    }
  }, [userId]);

  const getStatus = (algorithmId) => {
    const entry = progress.find((p) => p.ALGORITHM_ID === algorithmId);
    return entry ? entry.STATUS : "NONE";
  };

  const renderCards = (algos) =>
    algos.map(({ ALGORITHM_ID, NAME, MOVE_SEQUENCE }) => (
      <AlgorithmCard
        key={ALGORITHM_ID}
        imageSrc={`/src/images/${ALGORITHM_ID}.png`}
        name={NAME}
        algorithm={MOVE_SEQUENCE}
        userId={userId}
        algorithmId={ALGORITHM_ID}
        initialStatus={getStatus(ALGORITHM_ID)}
        onStatusChange={() => {
          fetch(`/api/v1/progress?userId=${userId}`)
            .then((res) => res.json())
            .then(setProgress);
        }}
      />
    ));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TrainerHeader />
        <div className="flex flex-1 bg-[#B4B6B9]">
          <div className="p-6 overflow-y-auto flex-1">
            <img
              src={notationImage}
              alt="Notation Guide"
              className="w-full max-w-4xl mx-auto mb-8 rounded-lg shadow"
            />

            <section id="two-look-oll" className="mb-10">
              <h2 className="text-xl font-semibold mb-4">2-Look OLL</h2>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] gap-6">
                {renderCards(twoLookOll)}
              </div>
            </section>

            <section id="two-look-pll" className="mb-10">
              <h2 className="text-xl font-semibold mb-4">2-Look PLL</h2>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] gap-6">
                {renderCards(twoLookPll)}
              </div>
            </section>

            <section id="oll" className="mb-10">
              <h2 className="text-xl font-semibold mb-4">OLL</h2>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] gap-6">
                {renderCards(oll)}
              </div>
            </section>

            <section id="pll" className="mb-10">
              <h2 className="text-xl font-semibold mb-4">PLL</h2>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))] gap-6">
                {renderCards(pll)}
              </div>
            </section>
          </div>

          <RightSidebar
            twoLookOll={twoLookOll}
            twoLookPll={twoLookPll}
            oll={oll}
            pll={pll}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
