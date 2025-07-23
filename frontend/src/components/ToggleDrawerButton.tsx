import React from "react";
import { Button } from "./ui/button";

interface ToggleDrawerButtonProps {
  onClick?: () => void;
}

const ToggleDrawerButton: React.FC<ToggleDrawerButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="
      relative w-full sm:w-32 max-w-50 px-6 rounded-xl sm:py-5 md:py-7 
      border border-[#E21833] bg-white text-[#E21833] font-medium
      overflow-hidden
      before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1
      before:bg-gradient-to-r before:from-[#E21833] before:via-[#FFD200] before:to-[#E21833]
      before:scale-x-0 before:origin-left before:transition-transform before:duration-300
      transition-colors transition-shadow duration-300 ease-in-out transform
      hover:bg-[#E21833] hover:text-white hover:shadow-md hover:scale-105
      hover:before:scale-x-100
      focus:outline-none focus:ring-2 focus:ring-[#FFD200]/50
    "
  >
    Totals
  </Button>
);

export default ToggleDrawerButton;
