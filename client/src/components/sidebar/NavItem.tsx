import { Link, useLocation } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectUser } from "@providers/authSlice";
import { NavLink } from "@constants/nav";


interface Props extends NavLink {
  isOpen: boolean;
  onToggleMenu: any;
  vCounts?: { new: number; pending: number; priority: number; working: number }; // Add vCounts as a prop
}

const NavItem = (props: Props) => {
  const location = useLocation();
  const user = useSelector(selectUser);

  const isActive = () => {
    if (location.pathname === props.path) {
      return true;
    }
    if (
      props.hasSub &&
      props.sub &&
      props.sub.some((subItem) => location.pathname.startsWith(subItem.path))
    ) {
      return true;
    }
    return false;
  };

  if (props.hasSub) {
    const subNav = props.sub.filter(
      (link) => user?.role && link.Roles.includes(user.role)
    );
    return (
      <div>
        <div
          className={`flex items-center justify-between p-2 shadow-sm rounded-xl hover:cursor-pointer transition-all duration-200 ${
            isActive()
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-black hover:bg-purple-200"
          }`}
          onClick={props.onToggleMenu}
          aria-expanded={props.isOpen}
        >
          <div className='flex items-center gap-4'>
            <div
              className={`p-2 font-bold rounded-xl ${
                isActive() ? "bg-white text-purple-600" : "text-black"
              }`}
            >
              {<props.icon />}
            </div>
            <p className={`${isActive() ? "text-white" : ""}`}>{props.name}</p>
          </div>

          <span
            className={`transform transition-transform duration-200 ${
              props.isOpen ? "rotate-0" : "rotate-90"
            }`}
          >
            <IoMdArrowDropdown />
          </span>
        </div>

        <div
          className={`flex flex-col gap-2 mt-2 ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
            props.isOpen
              ? "max-h-[1000px] opacity-100 animate-slide-down"
              : "max-h-0 opacity-0"
          }`}
          aria-hidden={!props.isOpen}
        >
          {subNav.map((subItem) => (
            <Link
              to={subItem.path}
              key={subItem.name}
              className={`flex items-center justify-between gap-4 p-2 text-sm transition-all duration-200 rounded-lg hover:cursor-pointer bg-gray-200 text-black hover:bg-purple-200 ${
                location.pathname === subItem.path
                  ? "bg-purple-600 text-white"
                  : ""
              }`}
            >
              <p>{subItem.name}</p>
              {/* Show count for specific submenu items */}
              {props.vCounts &&
                subItem.name === "New" &&
                props.vCounts.new > 0 && (
                  <span className='text-sm font-bold text-purple-600 bg-white rounded-full px-2 py-1'>
                    {props.vCounts.new}
                  </span>
                )}
              {props.vCounts &&
                subItem.name === "Pending" &&
                props.vCounts.pending > 0 && (
                  <span className='text-sm font-bold text-purple-600 bg-white rounded-full px-2 py-1'>
                    {props.vCounts.pending}
                  </span>
                )}
              {props.vCounts &&
                subItem.name === "Priority" &&
                props.vCounts.priority > 0 && (
                  <span className='text-sm font-bold text-purple-600 bg-white rounded-full px-2 py-1'>
                    {props.vCounts.priority}
                  </span>
                )}
              {props.vCounts &&
                subItem.name === "Working" &&
                props.vCounts.working > 0 && (
                  <span className='text-sm font-bold text-purple-600 bg-white rounded-full px-2 py-1'>
                    {props.vCounts.working}
                  </span>
                )}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return (
    <Link
      to={props.path}
      className={`flex items-center justify-between p-2 shadow-sm rounded-xl hover:cursor-pointer transition-all duration-200 ${
        isActive()
          ? "bg-purple-600 text-white"
          : "bg-gray-200 text-black hover:bg-purple-200"
      }`}
    >
      <div className='flex items-center gap-4'>
        <div
          className={`p-2 font-bold rounded-xl ${
            isActive() ? "bg-white text-purple-600" : "text-black"
          }`}
        >
          {<props.icon />}
        </div>
        <p className={`${isActive() ? "text-white" : ""}`}>{props.name}</p>
      </div>
    </Link>
  );
};

export default NavItem;
