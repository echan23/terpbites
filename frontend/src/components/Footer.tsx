import { FaReact, FaAws } from "react-icons/fa";
import { SiFlask, SiMysql, SiPython } from "react-icons/si";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 bg-[#E21833] py-2 sm:py-3 md:py-4 w-full mb-safe-area-inset-bottom">
      <div className="flex items-center justify-center sm:justify-between px-2 sm:px-4">
        <div className="flex-shrink-0">
          {/* Mobile: Show copyright */}
          <span className="text-white font-medium text-xs sm:hidden">
            © 2025 TerpBites
          </span>

          {/* Desktop: Show hover card */}
          <div className="hidden sm:block">
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger className="text-white font-medium cursor-pointer text-sm">
                Check Us Out on Linkedin!
              </HoverCardTrigger>
              <HoverCardContent
                className="
                  bg-white
                  backdrop-blur-sm
                  rounded-xl
                  p-4
                  shadow-lg
                  max-w-xs
                  text-sm
                  leading-relaxed
                  font-normal
                  text-black
                  transition-none
                  z-50
                "
                side="top"
                align="start"
              >
                <div className="flex flex-col gap-1">
                  <a
                    href="https://www.linkedin.com/in/edchan23/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                  >
                    @Edward Chan
                  </a>
                  <a
                    href="https://www.linkedin.com/in/benjaminliumd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                  >
                    @Ben Li
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        {/* Hide tech stack icons on mobile, show on sm and up */}
        <div className="hidden sm:flex gap-2 sm:gap-4 items-center sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <FaReact
            title="ReactJS"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-slideUp"
          />
          <SiFlask
            title="Flask"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-slideUp [animation-delay:.1s]"
          />
          <SiPython
            title="Python"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-slideUp [animation-delay:.2s]"
          />
          <SiMysql
            title="MySQL"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-slideUp [animation-delay:.3s]"
          />
          <FaAws
            title="AWS"
            className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-slideUp [animation-delay:.4s]"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
