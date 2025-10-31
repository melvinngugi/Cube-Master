export default function Sidebar() {
  return (
    <div className="w-64 bg-[#6D7276] text-white flex flex-col justify-between p-4">
      {/* Logo + Buttons */}
      <div>
        <img src="/logo.jpg" alt="Cube Master Logo" className="w-full mb-6" />
        <div className="space-y-4 mb-8">
          <button className="w-full bg-[#29A7D1] text-white py-2 rounded">Timer</button>
          <button className="w-full bg-[#29A7D1] text-white py-2 rounded">Trainer</button>
          <button className="w-full bg-[#29A7D1] text-white py-2 rounded">Review</button>
        </div>

        {/* Stats Table */}
        <div
          className="bg-[#B3B3B3] text-black p-2 mb-6 rounded-lg"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div></div>
            <div className="font-bold">current</div>
            <div className="font-bold">best</div>

            <div>time</div>
            <div>25.74</div>
            <div>22.13</div>

            <div>ao5</div>
            <div>28.12</div>
            <div>26.45</div>

            <div>ao12</div>
            <div>30.01</div>
            <div>27.89</div>
          </div>
        </div>

        {/* Solve History Table */}
        <div
          className="bg-[#B3B3B3] text-black p-2 grow overflow-y-auto rounded-lg"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">index</th>
                <th className="text-left">time</th>
                <th className="text-left">ao5</th>
                <th className="text-left">ao12</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>9</td><td>25.74</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>8</td><td>30.54</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>7</td><td>29.06</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>6</td><td>32.67</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>5</td><td>30.54</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>4</td><td>29.06</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>3</td><td>25.74</td><td>28.12</td><td>30.01</td></tr>
              <tr><td>2</td><td>32.67</td><td>28.12</td><td>30.01</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="flex justify-between items-center mt-4">
        {/* Profile Icon */}
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </button>

        {/* Signout Icon */}
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </div>
  );
}