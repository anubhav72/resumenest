import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ title, content, onClose, isOpen }) {
  if (!isOpen) return null;

  return (
    // <AnimatePresence>
    
    //     <>
    //       {/* Backdrop */}
    //       <motion.div
    //         className="fixed inset-0 bg-black bg-opacity-50 z-40"
    //         onClick={onClose}
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         exit={{ opacity: 0 }}
    //       />

    //       {/* Modal */}
    //       <motion.div
    //         className="fixed inset-0 z-50 flex items-center justify-center"
    //         initial={{ opacity: 0, scale: 0.9 }}
    //         animate={{ opacity: 1, scale: 1 }}
    //         exit={{ opacity: 0, scale: 0.9 }}
    //       >
    //         <div
    //           className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-50"
    //           onClick={(e) => e.stopPropagation()} // Prevent click from closing
    //         >
    //           {/* Close Button */}
    //           <button
    //             onClick={onClose}
    //             className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
    //           >
    //             &times;
    //           </button>

    //           {/* Title */}
    //           <h2 className="text-xl font-semibold mb-4">{title}</h2>

    //           {/* Content */}
    //           <div className="text-gray-700">{content}</div>
    //         </div>
    //       </motion.div>
    //     </>
     
    // </AnimatePresence>

    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white  rounded-xl shadow-lg w-full max-w-md p-6 relative z-50 transform transition-all scale-100"
          onClick={(e) => e.stopPropagation()} // Prevent backdrop close
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:text-gray-300 text-2xl font-bold"
          >
            &times;
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">{title}</h2>

          {/* Content */}
          <div className="text-gray-700">{content}</div>
        </div>
      </div>
    </>
  );
}
