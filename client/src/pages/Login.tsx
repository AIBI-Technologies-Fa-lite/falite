import logo from "/fa-lite-logo.svg";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PiEyeSlash, PiEyeLight } from "react-icons/pi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, selectSession, selectUser, changeSession } from "@providers/authSlice";
import { useLoginMutation } from "@api/authApi";

// Types import
import { Credentials, Location } from "src/types";

const Login = () => {
  // States for form input password and terms and conditions
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  //Check for previous session expiry
  const session = useSelector(selectSession);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!session && !user) {
      toast.info("Session Expired! Please Login Again");
      dispatch(changeSession());
    }
  }, []);
  // Initializing login mutation
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Credentials>();

  type TempLocation = Location | undefined;

  const onSubmit = async (data: Credentials) => {
    console.log(data)
    const credentials = data;

    // Initialize location as an empty object with optional latitude and longitude
    let location: TempLocation = undefined;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Assign latitude and longitude to the location
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        try {
          // Call the login function with credentials and location
          const response = await login({ credentials, location }).unwrap();
          dispatch(setCredentials({ user: response.data.user }));
          reset();
          navigate("/");
        } catch (err) {
          // Handle login error here
          toast.error("Login failed. Please try again.");
        }
      },
      (error) => {
        // Handle geolocation error
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location services are turned off. Please enable them and try again.");
        } else {
          toast.error("Unable to retrieve location. Please try again.");
        }
      }
    );
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative flex flex-col items-center row-span-1 gap-8 p-4 md:row-span-6 md:justify-center md:p-0">
        <div className="absolute bg-purple-400 rounded-bl-full w-[200px] h-[200px] top-0 right-0 blur-3xl md:rounded-br-full md:rounded-bl-none md:left-0 md:w-[300px] md:h-[300px] z-0"></div>
        <div className="z-10 flex items-center gap-4">
          <img src={logo} alt="" className=" h-[80px]" />
          <p className="text-purple-900 text-7xl">
            FA <span className="font-thin text-gray-600">lite</span>
          </p>
        </div>
        <div className="z-10 hidden text-gray-600 md:block">Copyright © 2024 AIBI Tech. All rights reserved.</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center mx-auto row-span-5 gap-8 p-4 md:row-span-6 w-[90%] md:w-[60%]">
        <p className="z-10 mx-auto text-4xl font-bold">Sign In</p>
        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col gap-1">
            <label htmlFor="email">Email {errors.email ? <span className="text-red-500">*</span> : null}</label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email"
              className={`p-2 pl-4 placeholder-gray-700 ${
                errors.email ? "bg-red-200" : "bg-purple-200"
              } rounded-md focus:outline-purple-900 placeholder:text-gray-500`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <div className="absolute flex items-center transform -translate-y-1/2 right-3 top-12">
              <IoIosCloseCircleOutline className="text-gray-500 cursor-pointer" onClick={() => reset({ email: "" })} />
            </div>
          </div>
          <div className="relative flex flex-col gap-1 mt-3">
            <label htmlFor="password">Password {errors.password ? <span className="text-red-500">*</span> : null}</label>
            <input
              id="password"
              type={hiddenPassword ? "password" : "text"}
              placeholder="Enter Password"
              className={`p-2 pl-4 placeholder-gray-700 ${
                errors.password ? "bg-red-200" : "bg-purple-200"
              } rounded-md focus:outline-purple-900 placeholder:text-gray-500`}
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <div className="absolute flex items-center transform -translate-y-1/2 right-3 top-12">
              {hiddenPassword ? (
                <PiEyeSlash
                  className="text-gray-500 cursor-pointer"
                  onClick={() => {
                    setHiddenPassword(!hiddenPassword);
                  }}
                />
              ) : (
                <PiEyeLight
                  className="text-gray-500 cursor-pointer"
                  onClick={() => {
                    setHiddenPassword(!hiddenPassword);
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required />
            <label htmlFor="agreeTerms" className="text-gray-700">
              Accept the <span className="text-purple-500">Terms and Conditions</span>
            </label>
          </div>
          <button
            type="submit"
            className="p-2 text-white transition-colors duration-200 bg-purple-600 rounded hover:bg-purple-500 hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
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

export default Login;
