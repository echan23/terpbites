import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AboutModal from "./AboutModal";

const MotionButton = motion(Button);

const headerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300 },
  },
};

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const title = "TERPBITES".split("");

  return (
    <motion.header
      className="relative flex items-center justify-center bg-white py-4 border-b-4 border-red-700 shadow-md"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        style={{ fontFamily: "Academy, sans-serif" }}
        className="text-5xl font-extrabold tracking-wider flex space-x-1 text-red-700"
      >
        {title.map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className={`inline-block ${
              // Rotate color pattern for red, gold, black
              index % 3 === 0
                ? "text-red-700"
                : index % 3 === 1
                ? "text-yellow-500"
                : "text-black"
            }`}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* About button with animation */}
      <motion.div className="absolute right-4" variants={letterVariants}>
        <MotionButton
          variant="outline"
          className="px-6 py-2 rounded-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-black transition-colors duration-200 font-semibold shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          About
        </MotionButton>
      </motion.div>

      {/* About Modal */}
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.header>
  );
};

export default Header;
