import React, { useState } from "react";
import Modal from "./Modal";

const MarkdownModal = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      {" "}
      <p className="text-xs text-gray-600 ">
        Markdown is supported (
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Cheat codes
        </span>
        )
      </p>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formatting Guide"
        content={
          <div className="text-sm text-gray-700">
            <p className="mb-3">
              You can format your text using the following rules:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[13px]">
              <li>
                <span className="font-semibold">Bullet points:</span> Start a
                line with{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">- </code>
                Example: <code>- This is a bullet point</code>
              </li>
              <li>
                <span className="font-semibold">Bold text:</span> Wrap text with{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">_</code>
                Example: <code>_This will be bold_</code>
              </li>
              <li>
                <span className="font-semibold">Italic text:</span> Wrap text
                with <code className="bg-gray-100 px-1 py-0.5 rounded">*</code>
                Example: <code>*This will be italic*</code>
              </li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-[#229477] text-white hover:bg-[#48bf9d]"
              >
                Got it
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default MarkdownModal;
