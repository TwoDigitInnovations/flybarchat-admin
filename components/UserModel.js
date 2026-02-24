"use client";
import React from "react";
import { X } from "lucide-react";

function UserModal({ user, isOpen, onClose, onApprove, onSuspend }) {
  if (!isOpen) return null;

  const status = user?.status; // pending | active | suspended

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[320px] rounded-lg p-6 relative text-center font-poppins">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Profile Image */}
        <img
          src={user?.image || "https://i.pravatar.cc/150"}
          alt="profile"
          className="w-24 h-24 rounded-md mx-auto object-cover mb-3"
        />

        {/* User Info */}
        <h2 className="text-lg font-semibold text-gray-800">
          {user?.name}
        </h2>
        <p className="text-gray-500 text-sm">{user?.email}</p>
        <p className="text-gray-500 text-sm mb-4">{user?.phone}</p>

        {/* Stats */}
        <div className="text-sm text-gray-600 space-y-1 mb-6">
          <div className="flex justify-between px-6">
            <span>Total Purchase</span>
            <span className="font-medium">{user?.totalPurchase}</span>
          </div>
          <div className="flex justify-between px-6">
            <span>Total Spend</span>
            <span className="font-medium">{user?.totalSpend}</span>
          </div>
        </div>

        {/* Status Buttons */}
        <div className="border-t pt-4">
          {status === "pending" && (
            <button
              onClick={() => onApprove(user)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium"
            >
              Approve User
            </button>
          )}

          {status === "active" && (
            <button
              onClick={() => onSuspend(user)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium"
            >
              Suspend User
            </button>
          )}

          {status === "suspended" && (
            <button
              onClick={() => onApprove(user)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium"
            >
              Reactivate User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserModal;
