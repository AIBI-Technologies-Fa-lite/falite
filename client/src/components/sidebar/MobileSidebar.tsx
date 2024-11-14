import logo from "/fa-lite-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@providers/authSlice";
import NavLinks, { NavLink } from "@constants/nav";
import NavItem from "./NavItem";
import { useState, useRef } from "react";

const MobileSidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const sidebarRef = useRef(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleToggleMenu = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  const allowedNav = NavLinks.filter((link: NavLink) => user?.role && link.Roles.includes(user?.role));

  return (
    <>
      {/* Sidebar container */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-64 min-h-screen bg-gray-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center w-full gap-4 p-4 bg-white">
          <img src={logo} alt="Logo" className="h-[32px]" />
          <p className="text-xl text-purple-900">
            FA <span className="font-thin text-gray-600">lite</span>
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 px-4 mt-6">
          {allowedNav.map((nav: NavLink) => (
            <NavItem key={nav.name} {...nav} isOpen={openMenu === nav.name} onToggleMenu={() => handleToggleMenu(nav.name)} />
          ))}
        </div>

        {/* Logout Button */}
        <div className="w-full p-4">
          <div
            className="flex items-center justify-center py-2 text-white transition-all duration-200 bg-purple-600 rounded-xl hover:cursor-pointer hover:bg-purple-400"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && <div className="fixed inset-0 z-40 w-full backdrop-blur-3xl" onClick={toggleSidebar}></div>}
    </>
  );
};

export default MobileSidebar;
