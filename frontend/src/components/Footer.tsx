import { FaReact, FaAws } from "react-icons/fa";
import { SiFlask, SiMysql, SiPython } from "react-icons/si";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  return (
    <footer className="bg-[#E21833] py-4">
      <div className="flex items-center relative">
        <div className="flex-shrink-0 ml-4">
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger className="text-white font-medium cursor-pointer">
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
                "
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

        {/* Center: Icons */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 items-center">
          <FaReact
            title="ReactJS"
            className="w-5 h-5 text-white animate-slideUp"
          />
          <SiFlask
            title="Flask"
            className="w-5 h-5 text-white animate-slideUp [animation-delay:.1s]"
          />
          <SiPython
            title="Python"
            className="w-5 h-5 text-white animate-slideUp [animation-delay:.2s]"
          />
          <SiMysql
            title="MySQL"
            className="w-5 h-5 text-white animate-slideUp [animation-delay:.3s]"
          />
          <FaAws
            title="AWS"
            className="w-5 h-5 text-white animate-slideUp [animation-delay:.4s]"
          />
        </div>

        {/* Invisible spacer to balance layout */}
        <div className="flex-shrink-0 invisible ml-4">Hover for Info</div>
      </div>
    </footer>
  );
};

export default Footer;
