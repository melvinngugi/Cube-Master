// src/components/AddTimeModal.jsx
import { useState } from "react";

export default function AddTimeModal({ isOpen, onClose, onSave, saving }) {
  const [time, setTime] = useState("");
  const [scramble, setScramble] = useState("");
  const [cube, setCube] = useState("333");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!time || !scramble) return;
    onSave({
      time: parseFloat(time),
      scramble,
      cube,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">
        <h2 className="text-lg font-bold">Add Solve</h2>
        <div>
          <label className="block text-sm">Time (seconds)</label>
          <input
            type="number"
            step="0.01"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Scramble</label>
          <input
            type="text"
            value={scramble}
            onChange={(e) => setScramble(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Cube Type</label>
          <select
            value={cube}
            onChange={(e) => setCube(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="333">3×3×3</option>
            <option value="222">2×2×2</option>
            <option value="pyram">Pyraminx</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-[#29A7D1] text-white rounded hover:opacity-90"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
