import { createBrowserRouter } from "react-router-dom";

import LoginGuard from "./LoginGuard";

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
      {
        path: "/user",
        element: <Layout />,
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
        element: <Layout />,
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
        element: <Layout />,
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
