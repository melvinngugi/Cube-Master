import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

export default function RightSidebar({
  twoLookOll = [],
  twoLookPll = [],
  oll = [],
  pll = [],
  progress = [],
}) {
  const [openBeginner, setOpenBeginner] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const countByCategory = (category, status) =>
    progress.filter(
      (p) => p.STATUS === status && p.CATEGORY === category
    ).length;

  return (
    <div className="w-64 bg-[#6D7276] text-white p-4 shadow-lg sticky top-0 h-screen overflow-y-auto">
      {/*Beginner Dropdown*/}
      <div>
        <button
          onClick={() => setOpenBeginner(!openBeginner)}
          className="w-full text-left font-semibold mb-2"
        >
          Beginner
        </button>
        {openBeginner && (
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection("two-look-oll")}
              className="text-sm hover:text-gray-200 text-left"
            >
              2-Look OLL
            </button>
            <button
              onClick={() => scrollToSection("two-look-pll")}
              className="text-sm hover:text-gray-200 text-left"
            >
              2-Look PLL
            </button>
          </div>
        )}
      </div>

      {/*Progress bars for Beginner*/}
      <div className="mt-4 space-y-4">
        <ProgressBar
          label="2-Look OLL Progress"
          total={twoLookOll.length}
          learningCount={countByCategory("2LOOK_OLL", "LEARNING")}
          learnedCount={countByCategory("2LOOK_OLL", "LEARNED")}
        />
        <ProgressBar
          label="2-Look PLL Progress"
          total={twoLookPll.length}
          learningCount={countByCategory("2LOOK_PLL", "LEARNING")}
          learnedCount={countByCategory("2LOOK_PLL", "LEARNED")}
        />
      </div>

      {/*Advanced Dropdown*/}
      <div className="mt-6">
        <button
          onClick={() => setOpenAdvanced(!openAdvanced)}
          className="w-full text-left font-semibold mb-2"
        >
          Advanced
        </button>
        {openAdvanced && (
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection("oll")}
              className="text-sm hover:text-gray-200 text-left"
            >
              OLL
            </button>
            <button
              onClick={() => scrollToSection("pll")}
              className="text-sm hover:text-gray-200 text-left"
            >
              PLL
            </button>
          </div>
        )}
      </div>

      {/*Progress bars for Advanced*/}
      <div className="mt-4 space-y-4">
        <ProgressBar
          label="OLL Progress"
          total={oll.length}
          learningCount={countByCategory("OLL", "LEARNING")}
          learnedCount={countByCategory("OLL", "LEARNED")}
        />
        <ProgressBar
          label="PLL Progress"
          total={pll.length}
          learningCount={countByCategory("PLL", "LEARNING")}
          learnedCount={countByCategory("PLL", "LEARNED")}
        />
      </div>
    </div>
  );
}
