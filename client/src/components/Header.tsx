import { useState } from "react";
import MobileSidebar from "./sidebar/MobileSidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "/fa-lite-logo.svg";
const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="relative flex items-center w-full px-4 bg-white ">
      <GiHamburgerMenu className="text-xl" onClick={toggleSidebar} />
      <div className="flex items-center justify-center w-full gap-4 p-4 bg-white md:shadow-xl">
        <img src={logo} alt="" className="h-[32px]" />
        <p className="text-xl text-purple-900">
          FA <span className="font-thin text-gray-600">lite</span>
        </p>
      </div>
      <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Header;
