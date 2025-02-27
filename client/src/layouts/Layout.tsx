import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@components/sidebar/Sidebar";
import Top from "@components/Top";
import Header from "@components/Header";
const Layout = () => {
  return (
    <div className='min-h-screen'>
      <div className='md:hidden'>
        <Header />
      </div>
      <div className='grid grid-cols-6'>
        <div className='hidden md:col-span-1 md:block'>
          <Sidebar />
        </div>
        <div className='h-screen col-span-6 px-4 bg-gray-100 md:col-span-5 md:px-14 md:overflow-y-auto'>
          <Top />
          <Outlet />
        </div>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layout;
