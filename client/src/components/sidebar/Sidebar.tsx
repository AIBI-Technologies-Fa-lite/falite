import logo from "/fa-lite-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@providers/authSlice";
import NavLinks, { NavLink } from "@constants/nav";
import NavItem from "./NavItem";
import { useState } from "react";
import { useGetVCountsQuery } from "@api/notificationApi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleToggleMenu = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name)); // Toggling the menu state
  };

  const allowedNav = NavLinks.filter(
    (link: NavLink) => user?.role && link.Roles.includes(user?.role)
  );

  const { data } = useGetVCountsQuery({});

  return (
    <div className='flex flex-col h-full min-h-screen gap-6 shadow-xl'>
      <div className='flex items-center justify-center w-full gap-4 p-4 bg-white h-[80px]'>
        <img src={logo} alt='FA Lite Logo' className='h-[50px]' />
        <p className='text-4xl text-purple-900'>
          FA <span className='font-thin text-gray-600'>lite</span>
        </p>
      </div>
      <div className='flex flex-col gap-4 px-4'>
        {allowedNav.map((nav: NavLink) => (
          <NavItem
            key={nav.name}
            {...nav}
            isOpen={openMenu === nav.name}
            onToggleMenu={() => handleToggleMenu(nav.name)}
            vCounts={data?.data} // Pass fetched data here
          />
        ))}
      </div>
      <div className='w-full p-4'>
        <div
          className='flex items-center justify-center py-2 text-white transition-all duration-200 bg-purple-600 rounded-xl hover:cursor-pointer hover:bg-purple-400'
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
