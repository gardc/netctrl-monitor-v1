import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiShieldUserFill,
  RiShieldFlashFill,
  RiShieldKeyholeFill,
} from "react-icons/ri";
import { setEmail, setToken } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import remoteUrlBase from "../lib/remoteUrlBase";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const proUser = useSelector((state) => state.user.proUser);

  const signOut = () => {
    dispatch(setEmail(""));
    dispatch(setToken(""));
    localStorage.setItem("rememberMe", "false");
    navigate(`/`);
  };

  return (
    <div
      className="p-12 bg-gray-800 select-none w-full h-full"
    >
      <h2 className="text-2xl font-bold">My Page</h2>
      <p className="mt-2 text-gray-400">See and manage your NetCTRL account.</p>

      <div className="mt-6 w-full flex flex-col items-center">
        <div className="px-8 py-6 flex flex-col items-center justify-center bg-gray-900 rounded-xl w-full">
          <p className="text-sm text-gray-500 uppercase">Signed in as</p>
          <div className="mt-1 flex justify-center items-center">
            <RiShieldUserFill className="text-gray-100 text-xl" />
            <p className="ml-2 text-md font-semibold">{email}</p>
          </div>
        </div>
        {/* Account type */}
        <div className="mt-6 w-full flex flex-col items-center">
          <div className="px-8 py-6 flex flex-col items-center justify-center bg-gray-900 rounded-xl w-full">
            <p className="text-sm text-gray-500 uppercase">Account type</p>
            <div className="mt-1 flex justify-center items-center flex-col">
              <div className="flex items-center justify-center">
                {proUser ? (
                  <RiShieldFlashFill className="text-gray-100 text-xl" />
                ) : (
                  <RiShieldKeyholeFill className="text-gray-100 text-xl" />
                )}
                <p className="ml-2 text-md font-semibold">
                  {proUser ? "Pro user" : "Free user"}
                </p>
              </div>
              {!proUser && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.runtime.BrowserOpenURL(`${remoteUrlBase()}/user/upgrade`);
                  }}
                  className="px-2 py-1 border border-red-600 rounded-md mt-2 text-sm font-medium text-red-600 opacity-50 hover:opacity-100 transition-opacity"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <button
          className=" px-6 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-500"
          onClick={() => signOut()}
        >
          Sign out
        </button>
        <button
          className="ml-4 text-gray-200 hover:text-red-600 hover:underline transition-all"
          onClick={() => window.runtime.BrowserOpenURL(`${remoteUrlBase()}/user/dashboard`)}
        >
          Manage account
        </button>
      </div>
    </div>
  );
};

export default UserPage;
