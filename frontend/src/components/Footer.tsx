import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 bg-[#E21833] py-2 sm:py-3 md:py-4 w-full mb-safe-area-inset-bottom">
      <div className="flex items-center justify-center px-2 sm:px-4 relative">
        {/*<div className="hidden sm:block absolute left-2 sm:left-4">
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
        */}

        <div className="text-white font-medium text-xs sm:text-sm">
          © 2025 Terpbites
        </div>
      </div>
    </footer>
  );
};

export default Footer;
