import { createBrowserRouter } from "react-router-dom";

import LoginGuard from "./LoginGuard";
import RoleGuard from "./RoleGuard";

import Layout from "src/layouts/Layout";

import Login from "@pages/Login";
import HomeRouter from "@pages/HomeRouter";
import AddUsers from "@pages/Admin/AddUsers";
import ViewUsers from "@pages/Admin/ViewUsers";
import ViewUser from "@pages/Admin/ViewUser";
import AddBranch from "@pages/Admin/AddBranch";
import ViewBranches from "@pages/Admin/ViewBranches";
import AddVT from "@pages/Admin/AddVT";
import ViewVT from "@pages/Admin/ViewVT";

import AddCase from "@pages/Cre/AddCase";
import { Role } from "@constants/enum";

const adminRoutes = {
  path: "/",
  element: <RoleGuard allowedRoles={[Role.ADMIN]} children={<Layout />} />,
  children: [
    {
      path: "/user",

      children: [
        {
          path: "/user/add",
          element: <AddUsers />
        },
        {
          path: "/user",
          element: <ViewUsers />
        },
        {
          path: "/user/:id",
          element: <ViewUser />
        }
      ]
    },
    {
      path: "/branch",
      children: [
        {
          path: "/branch",
          element: <ViewBranches />
        },
        {
          path: "/branch/add",
          element: <AddBranch />
        }
      ]
    },
    {
      path: "/vt",
      children: [
        {
          path: "/vt",
          element: <ViewVT />
        },
        {
          path: "/vt/add",
          element: <AddVT />
        }
      ]
    }
  ]
};
const creRoutes = {
  path: "/",
  element: <RoleGuard allowedRoles={[Role.CRE]} children={<Layout />} />,
  children: [
    {
      path: "/verification",
      children: [
        {
          path: "/verification/case/add",
          element: <ViewVT />
        }
      ]
    }
  ]
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginGuard />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [{ path: "/", element: <HomeRouter /> }]
      },
      adminRoutes,
      creRoutes
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "*",
    element: <div className="h-screen flex justify-center items-center text-4xl font-bold">Not Found</div>
  }
]);

export default router;
