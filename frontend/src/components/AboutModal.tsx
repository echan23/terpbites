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
import { FaReact, FaPython } from "react-icons/fa";
import { SiFlask, SiAwsamplify } from "react-icons/si";

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
              Welcome to TerpBites! 🐢 Users can search for food items, view
              nutrition facts, and track meals. During the summer, there&apos;s
              nothing to scrape, so we put some spoof data to show how the app
              works—try searching for apples! P.S. Normally, the data is
              assigned to a location, but since we put spoof data in, we didn't
              assign a location. That's why if you filter by location, you won't
              see anything.
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400 shadow-inner">
            <p>
              TerpBites scrapes data daily from the UMD Dining Services website
              into an RDS database using the BeautifulSoup library. A Flask API,
              deployed on AWS Lambda, serves data to the React.js frontend
              hosted on S3.
            </p>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Tech Stack
            </p>
            <div className="flex justify-center items-center gap-8 mt-2 text-4xl text-gray-700">
              <div className="flex flex-col items-center">
                <FaReact
                  title="React.js"
                  className="hover:text-sky-500 transition"
                />
                <span className="text-xs mt-1">React.js</span>
              </div>
              <div className="flex flex-col items-center">
                <SiFlask
                  title="Flask"
                  className="hover:text-gray-500 transition"
                />
                <span className="text-xs mt-1">Flask</span>
              </div>
              <div className="flex flex-col items-center">
                <FaPython
                  title="BeautifulSoup"
                  className="hover:text-yellow-500 transition"
                />
                <span className="text-xs mt-1">Python</span>
              </div>
              <div className="flex flex-col items-center">
                <SiAwsamplify
                  title="AWS"
                  className="hover:text-orange-500 transition"
                />
                <span className="text-xs mt-1">AWS</span>
              </div>
            </div>
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
