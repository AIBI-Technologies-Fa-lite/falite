import { RouterProvider } from "react-router-dom";
import router from "@router/Router";

const App = () => {
  return (
    <div className="text-gray-800 font-montreal">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
