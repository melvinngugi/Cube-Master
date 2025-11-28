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
    <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
      {/* Beginner Dropdown */}
      <div>
        <button
          onClick={() => setOpenBeginner(!openBeginner)}
          className="w-full text-left font-semibold text-gray-800 mb-2"
        >
          Beginner
        </button>
        {openBeginner && (
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection("two-look-oll")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              2-Look OLL
            </button>
            <button
              onClick={() => scrollToSection("two-look-pll")}
              className="text-sm text-gray-600 hover:text-gray-900"
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
          className="w-full text-left font-semibold text-gray-800 mb-2"
        >
          Advanced
        </button>
        {openAdvanced && (
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection("oll")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              OLL
            </button>
            <button
              onClick={() => scrollToSection("pll")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              PLL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
