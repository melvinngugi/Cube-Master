// src/components/ProfileModal.jsx
import ModalPortal from "./ModalPortal";

export default function ProfileModal({ user, onClose }) {
  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] pointer-events-none">
        <div className="bg-white p-6 rounded shadow-lg w-80 text-black pointer-events-auto relative">
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
