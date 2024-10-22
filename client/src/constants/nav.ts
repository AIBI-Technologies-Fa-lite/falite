import { LuLayoutDashboard, LuUsers, LuShield } from "react-icons/lu";
import { Role } from "./enum";
import { IconType } from "react-icons";

export type NavLink = {
  name: string;
  icon: IconType;
  hasSub: boolean;
  path: string;
  Roles: Role[];
  sub: SubLink[] | [];
};
export type SubLink = { name: string; path: string; Roles: Role[] };
const NavLinks: NavLink[] = [
  {
    name: "Dashboard",
    icon: LuLayoutDashboard,
    hasSub: false,
    path: "/",
    Roles: [Role.ADMIN, Role.CRE, Role.DIRECTOR, Role.OF, Role.SUPERVISOR],
    sub: []
  },
  {
    name: "Users",
    icon: LuUsers,
    hasSub: true,
    path: "/user",
    Roles: [Role.ADMIN],
    sub: [
      { name: "Add Users", path: "/user/add", Roles: [Role.ADMIN] },
      { name: "View Users", path: "/user", Roles: [Role.ADMIN] }
    ]
  },
  {
    name: "Branches",
    icon: LuUsers,
    hasSub: true,
    path: "/branch",
    Roles: [Role.ADMIN],
    sub: [
      { name: "Add Branch", path: "/branch/add", Roles: [Role.ADMIN] },
      { name: "View Branches", path: "/branch", Roles: [Role.ADMIN] }
    ]
  },
  {
    name: "VerificationTypes",
    icon: LuShield,
    hasSub: true,
    path: "/vt",
    Roles: [Role.ADMIN],
    sub: [
      { name: "Add Verification", path: "/vt/add", Roles: [Role.ADMIN] },
      { name: "View Verifications", path: "/vt", Roles: [Role.ADMIN] }
    ]
  }
];

export default NavLinks;
