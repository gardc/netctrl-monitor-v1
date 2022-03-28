import React, { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import remoteUrlBase from "../lib/remoteUrlBase";
import { useDispatch } from "react-redux";
import {
  setEmail as setUserEmail,
  setProUser,
  setToken,
} from "../redux/slices/userSlice";
import { unauthedFetch } from "../lib/fetcher";
import EulaModal from "../Components/EulaModal";
import { setJWT } from "../services/ns/nsFunctions";

const LoginPage = () => {
  const [vantaEffect, setVantaEffect] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [hostname, setHostname] = useState("");
  const [machineId, setMachineId] = useState("");
  const [machineOs, setMachineOs] = useState("");
  const [eulaModalOpen, setEulaModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const myRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load saved credentials and get machine info
  useEffect(() => {
    if (localStorage.getItem("eulaAgreed") !== "true") {
      setEulaModalOpen(true);
    }
    if (localStorage.getItem("rememberMe") === "true") {
      setEmail(localStorage.getItem("email"));
      setPassword(localStorage.getItem("password"));
      setRememberMe(true);
    }

    // Get Information about system
    window.go.main.App.GetOS().then((v) => {
      setMachineOs(v);
      console.log(`received machine os: ${v}`);
    });
    window.go.main.App.GetMachineID().then((v) => {
      setMachineId(v);
      console.log(`received machine id: ${v}`);
    });
    window.go.main.App.GetMachineHostname().then((v) => {
      setHostname(v);
      console.log(`received machine hostname: ${v}`);
    });
    setLoading(false);
  }, []);

  // VantaEffect
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xac0000,
          backgroundColor: 0x161616,
          THREE: THREE,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  async function signIn({ email, password, hostname, machineId, machineOs }) {
    setLoading(true);
    console.log("machine OS:", machineOs);
    try {
      // Fetch login
      const r = await unauthedFetch(
        `${remoteUrlBase()}/api/monitorClient/signIn`,
        {
          body: {
            email: email,
            password: password,
            machine: {
              name: hostname,
              id: machineId,
              os: machineOs,
            },
          },
          method: "POST",
        }
      );
      const data = await r.json();
      console.log("login response: ", r);
      console.log("login response json: ", data);
      if (r.status === 200) {
        console.log("login response JSON: ", r);
        dispatch(setUserEmail(data.email));
        dispatch(setToken(data.token));
        setJWT(data.token);
        dispatch(setProUser(data.proUser));
        navigate("/main/network/");
      } else if (r.status === 500) {
        setLoginMsg(
          "There was a server error trying to sign in. Please contact support if this error persists."
        );
      } else {
        console.log("Login response error message: ", data.message);
        if (data.message !== undefined) {
          setLoginMsg(data.message);
        } else {
          setLoginMsg(
            "Could not sign in. Check that your email and password is correct, or contact support."
          );
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(
        "error trying to fetch login with base url",
        remoteUrlBase(),
        ": ",
        e
      );
      setLoginMsg(
        "There was an error signing in. Please check your internet connection, or contact support if this issue persists."
      );
      setLoading(false);
    }
  }

  const handleSubmit = (event) => {
    if (event !== null) event.preventDefault();

    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("rememberMe", "false");
    }
    signIn({ email, password, hostname, machineId, machineOs }).then();
  };

  return (
    <div className="bg-gray-900 flex flex-col justify-center items-center h-screen w-screen select-none">
      {/* Bg */}
      <div
        ref={myRef}
        className="h-screen w-screen z-10 filter blur-sm select-none"
      />

      {/* Draggable invisible overlay */}
      <div
        className="absolute z-20 h-screen w-screen opacity-0"
        data-wails-drag=""
      />

      {/* Close button */}
      {/* <button
        onClick={() => appWindow.close()}
        className="absolute z-30 top-0 left-0 m-4 px-4 py-2 bg-gray-500 bg-opacity-10 hover:bg-opacity-30 cursor-pointer text-gray-400 hover:text-gray-100 transition rounded-md"
      >
        <IoClose className="w-6 h-6" />
      </button> */}

      {/* Eula modal */}
      {!loading && (
        <EulaModal isOpen={eulaModalOpen} setIsOpen={setEulaModalOpen} />
      )}

      {/* Card */}
      <div
        className="absolute z-30 bg-gray-800 bg-opacity-70 p-8 w-96 rounded-md border border-gray-700 shadow-lg flex flex-col justify-center items-center"
        data-wails-no-drag=""
      >
        <p className="text-xs text-gray-400 uppercase font-medium">
          NetCTRL Monitor
        </p>
        <h4 className="text-xl font-semibold">Sign in to your account</h4>

        {/*Form*/}

        <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col">
          <label className="text-sm text-gray-300 uppercase">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your NetCTRL-registered email"
            className="mt-1 px-3 py-2 rounded-md text-gray-300 placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="mt-6 text-sm text-gray-300 uppercase">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-1 px-3 py-2 rounded-md text-gray-300 placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="mt-4 text-center text-sm text-red-600 font-semibold">
            {loginMsg}
          </p>

          <label className="mt-4 cursor-pointer grid grid-cols-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded bg-gray-800 border focus:border-gray-700 border-gray-700 text-red-600 focus:outline-none ring-0 focus:ring-2 focus:ring-red-400 focus:ring-offset-0 focus:ring-opacity-50 transition"
                checked={rememberMe}
                onChange={(e) => setRememberMe(!rememberMe)}
              />
              <span className="ml-2 text-gray-300">Remember me</span>
            </div>
            <div className="flex justify-end items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  window.runtime.BrowserOpenURL(
                    `${remoteUrlBase()}/auth/sendPasswordReset`
                  );
                }}
                className="text-gray-300 hover:underline cursor-pointer focus:underline hover:text-red-500 transition focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          </label>

          {(!loading && (
            <input
              type="submit"
              value="Sign In"
              className="mt-3 p-3 text-sm cursor-pointer transition bg-red-700 rounded-md hover:bg-red-600 focus:outline-none ring-0 focus:ring-2 ring-red-400 ring-opacity-50"
            />
          )) || (
            <button className="mt-3 p-3 text-sm transition bg-red-700 rounded-md focus:outline-none ring-0 focus:ring-2 ring-red-400 ring-opacity-50 disabled">
              <CgSpinnerTwoAlt className="animate-spin text-xl text-center w-full" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
