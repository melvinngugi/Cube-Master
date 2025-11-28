// src/components/RightSidebar.jsx
import React, { useState } from "react";

export default function RightSidebar() {
  const [openBeginner, setOpenBeginner] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-64 bg-[#6D7276] text-white p-4 shadow-lg sticky top-0 h-screen">
      {/* Beginner Dropdown */}
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

      {/* Advanced Dropdown */}
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
    </div>
  );
}
