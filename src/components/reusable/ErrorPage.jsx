import React from "react";
import { MdErrorOutline } from "react-icons/md";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <MdErrorOutline className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          An unexpected error has occurred. Please refresh the page and try
          again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#215a43] hover:bg-[#247151] text-white px-6 py-2 rounded-lg transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
