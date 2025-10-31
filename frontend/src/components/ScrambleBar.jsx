export default function ScrambleBar() {
  return (
    <div className="bg-[#6D7276] text-white px-6 py-6 w-full absolute top-0 z-10">
      {/* Dropdown + Navigation */}
      <div className="flex justify-between items-center mb-4">
        <select className="bg-[#B4B6B9] text-black px-2 py-1 rounded">
          <option>3×3×3</option>
          <option>2×2×2</option>
          <option>Pyraminx</option>
        </select>
        <div className="space-x-4 text-sm">
          <button className="underline">Previous Scramble</button>
          <button className="underline">Next Scramble</button>
        </div>
      </div>

      {/* Scramble Text */}
      <div className="text-4xl font-mono text-center">
        D' B R U R2 B R' D F' L2 B R2 D2 B2 F R2 U2 F' U
      </div>
    </div>
  );
}