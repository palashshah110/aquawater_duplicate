import { motion } from "framer-motion";
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <>
      {/* Loader container */}
      <div className="flex items-center justify-center w-full h-[70vh]">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 0.9,
            ease: "linear",
          }}
        />
      </div>
    </>
  );
};

export default LoadingSpinner;
