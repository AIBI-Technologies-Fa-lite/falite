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
    name: "Setup",
    icon: LuUsers,
    hasSub: true,
    path: "/setup",
    Roles: [Role.ADMIN],
    sub: [
      { name: "Add Branch", path: "/setup/branch/add", Roles: [Role.ADMIN] },
      { name: "View Branches", path: "/setup/branch", Roles: [Role.ADMIN] },
      { name: "Add Client", path: "/setup/client/add", Roles: [Role.ADMIN] },
      { name: "View Client", path: "/setup/client", Roles: [Role.ADMIN] },
      { name: "Add Product", path: "/setup/product/add", Roles: [Role.ADMIN] },
      { name: "View Products", path: "/setup/product", Roles: [Role.ADMIN] }
    ]
  },
  {
    name: "Verification Types",
    icon: LuShield,
    hasSub: true,
    path: "/vt",
    Roles: [Role.ADMIN],
    sub: [
      { name: "Add Verification", path: "/vt/add", Roles: [Role.ADMIN] },
      { name: "View Verifications", path: "/vt", Roles: [Role.ADMIN] }
    ]
  },
  {
    name: "Verifications",
    icon: LuShield,
    hasSub: true,
    Roles: [Role.CRE, Role.OF, Role.SUPERVISOR, Role.ACCOUNTS],
    path: "/verification",
    sub: [
      { name: "Billing", path: "/billing", Roles: [Role.ACCOUNTS] },
      {
        name: "New",
        path: "/verification/new",
        Roles: [Role.OF, Role.SUPERVISOR]
      },
      {
        name: "Pending",
        path: "/verification/pending",
        Roles: [Role.OF, Role.SUPERVISOR]
      },
      {
        name: "Priority",
        path: "/verification/priority",
        Roles: [Role.OF, Role.SUPERVISOR]
      },
      {
        name: "Working",
        path: "/verification/working",
        Roles: [Role.OF, Role.SUPERVISOR]
      },
      {
        name: "Completed",
        path: "/verification/completed",
        Roles: [Role.OF, Role.SUPERVISOR, Role.ACCOUNTS]
      },
      {
        name: "Create Case",
        path: "/verification/case/add",
        Roles: [Role.CRE]
      },
      {
        name: "View Cases",
        path: "/verification/case",
        Roles: [Role.CRE, Role.SUPERVISOR]
      }
    ]
  },
  {
    name: "GPS",
    icon: LuShield,
    hasSub: false,
    Roles: [Role.CRE, Role.SUPERVISOR],
    path: "/gps",
    sub: []
  }
];

export default NavLinks;
