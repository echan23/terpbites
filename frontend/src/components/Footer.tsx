import { FaReact, FaAws } from "react-icons/fa";
import { SiFlask, SiMysql, SiPython } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-[#E21833] py-6">
      <div className="container mx-auto text-center flex justify-center gap-6 items-center">
        <FaReact
          title="ReactJS"
          className="w-6 h-6 text-white animate-slideUp"
        />
        <SiFlask
          title="Flask"
          className="w-6 h-6 text-white animate-slideUp [animation-delay:.1s]"
        />
        <SiPython
          title="Python"
          className="w-6 h-6 text-white animate-slideUp [animation-delay:.2s]"
        />
        <SiMysql
          title="MySQL"
          className="w-6 h-6 text-white animate-slideUp [animation-delay:.3s]"
        />
        <FaAws
          title="AWS"
          className="w-6 h-6 text-white animate-slideUp [animation-delay:.4s]"
        />
      </div>
    </footer>
  );
};

export default Footer;
