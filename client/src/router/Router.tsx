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

import AddCase from "@pages/Verifications/AddCase";
import ViewCase from "@pages/Verifications/ViewCase";
import ViewCases from "@pages/Verifications/ViewCases";
import ViewVerifications from "@pages/Verifications/ViewVerifications";
import ViewVerification from "@pages/Verifications/ViewVerification";
import Tracking from "@pages/GPS/Tracking";
import Billing from "@pages/Verifications/Billing";
import AddClient from "@pages/Admin/AddClient";
import AddProduct from "@pages/Admin/AddProduct";
import ViewClients from "@pages/Admin/ViewClients";
import ViewProducts from "@pages/Admin/ViewProducts";

import { Role } from "@constants/enum";
import Bulk from "@pages/Verifications/Bulk";

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
      path: "/setup",
      children: [
        {
          path: "/setup/branch",
          element: <ViewBranches />
        },
        {
          path: "/setup/branch/add",
          element: <AddBranch />
        },
        {
          path: "/setup/client",
          element: <ViewClients />
        },
        {
          path: "/setup/client/add",
          element: <AddClient />
        },
        {
          path: "/setup/product",
          element: <ViewProducts />
        },
        { path: "/setup/product/add", element: <AddProduct /> }
      ]
    }
  ]
};

const vtRoutes = {
  path: "/",
  element: (
    <RoleGuard allowedRoles={[Role.CRE, Role.ADMIN]} children={<Layout />} />
  ),
  children: [
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
          element: <AddCase />
        }
      ]
    }
  ]
};
const verificationRoutes = {
  path: "/",
  element: (
    <RoleGuard
      allowedRoles={[Role.CRE, Role.SUPERVISOR, Role.OF, Role.ACCOUNTS]}
      children={<Layout />}
    />
  ),
  children: [
    {
      path: "/verification",
      children: [
        {
          path: "/verification/new",
          element: <ViewVerifications />
        },
        {
          path: "/verification/pending",
          element: <ViewVerifications />
        },
        {
          path: "/verification/working",
          element: <ViewVerifications />
        },
        {
          path: "/verification/priority",
          element: <ViewVerifications />
        },
        {
          path: "/verification/completed",
          element: <ViewVerifications />
        },
        {
          path: "/verification/bulk",
          element: <Bulk />
        },
        {
          path: "/verification/:id",
          element: <ViewVerification />
        },
        {
          path: "/verification/case",
          element: <ViewCases />
        },
        {
          path: "/verification/case/:id",
          element: <ViewCase />
        }
      ]
    }
  ]
};
const billingRoutes = {
  path: "/billing",
  element: <RoleGuard allowedRoles={[Role.ACCOUNTS]} children={<Layout />} />,
  children: [
    {
      path: "/billing",
      element: <Billing />
    }
  ]
};

const gpsRoutes = {
  path: "/gps",
  element: (
    <RoleGuard
      allowedRoles={[Role.SUPERVISOR, Role.CRE]}
      children={<Layout />}
    />
  ),
  children: [
    {
      path: "/gps",
      element: <Tracking />
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
      vtRoutes,
      creRoutes,
      verificationRoutes,
      gpsRoutes,
      billingRoutes
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "*",
    element: (
      <div className='h-screen flex justify-center items-center text-4xl font-bold'>
        Not Found
      </div>
    )
  }
]);

export default router;
