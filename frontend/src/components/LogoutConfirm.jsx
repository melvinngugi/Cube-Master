// src/components/LogoutConfirm.jsx
import { useAuth } from "../context/AuthContext";
import ModalPortal from "./ModalPortal";

export default function LogoutConfirm({ onClose }) {
  const { setToken } = useAuth();

  const handleConfirm = () => {
    setToken(null);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] pointer-events-none">
        <div className="bg-white text-black p-6 rounded shadow-md w-80 pointer-events-auto relative">
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p className="mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
