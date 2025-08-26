import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const AboutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-xl p-8 rounded-xl bg-white shadow-2xl border border-red-600">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="text-3xl font-extrabold mb-4 text-red-700 tracking-wide"
            style={{ fontFamily: "Academy, sans-serif" }}
          >
            About TerpBites
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 text-gray-800 text-base leading-relaxed">
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 shadow-inner">
            <p>
              Welcome to TerpBites! Users can search for food items, view
              nutrition facts, and track meals. If no data shows up for a
              particular food item, it is because UMD Dining Services has not
              provided any data for it.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex justify-center">
          <AlertDialogAction asChild>
            <Button
              onClick={() => onClose()}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Close
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AboutModal;
