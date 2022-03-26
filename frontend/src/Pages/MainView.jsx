import React, { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { GoSettings } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { RiHomeWifiLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import m from "../assets/M.svg";
import monitor from "../assets/MONITOR.svg";
import ErrorModal from "../Components/ErrorModal";
import PasswordPopup from "../Components/PasswordPopup";
import { setError } from "../redux/slices/nsSettings";
import { setupListeners } from "../services/ns/nsService";
import NetworkPage from "./Network";
import SettingsPage from "./Settings";
import UserPage from "./User";
import { initBackend } from "../services/ns/nsFunctions";

const Sidebar = (props) => {
  // Sidebar backdrop blur removed due to not working correctly on windows, and draining CPU time
  //  bg-opacity-90 hover:bg-opacity-100 backdrop-filter backdrop-blur-sm
  return (
    <div
      className="fixed z-20 whitespace-nowrap overflow-x-hidden transition-all duration-75 w-24 hover:w-64 border-r border-gray-700 pt-12 h-full top-0 left-0 bg-gray-900 flex flex-col items-center justify-between select-none"
      onMouseEnter={() => props.setSidebarOpen(true)}
      onMouseLeave={() => props.setSidebarOpen(false)}
      wails-drag-region=""
    >
      <div className="flex flex-col justify-center items-center">
        {props.sidebarOpen ? (
          <img
            src={monitor}
            alt="logo"
            className={"h-8 select-none w-44"}
            data-tauri-drag-region=""
          />
        ) : (
          <img
            src={m}
            alt="logo"
            className={"h-8 select-none w-10"}
            data-tauri-drag-region=""
          />
        )}

        <button
          className={
            "mt-12 py-3 px-4 hover:bg-gray-800 rounded-md flex items-center transition-colors focus:outline-none flex items-center" +
            (props.currPage === 0
              ? " bg-red-500 bg-opacity-10 text-red-500"
              : " text-gray-400") +
            (props.sidebarOpen ? " w-56 pl-12" : " w-16 justify-center")
          }
          onClick={() => props.setCurrPage(0)}
        >
          <RiHomeWifiLine className={"w-6 h-6"} />
          {props.sidebarOpen && <p className={"ml-3"}>Network</p>}
        </button>
        <button
          className={
            "mt-4 py-3 px-4 hover:bg-gray-800 rounded-md flex items-center transition-colors focus:outline-none flex items-center" +
            (props.currPage === 1
              ? " bg-red-500 bg-opacity-10 text-red-500"
              : " text-gray-400") +
            (props.sidebarOpen ? " w-56 pl-12" : " w-full justify-center")
          }
          onClick={() => props.setCurrPage(1)}
        >
          <GoSettings className={"w-6 h-6"} />
          {props.sidebarOpen && <p className={"ml-3"}>Settings</p>}
        </button>
        <button
          className={
            "mt-4 py-3 px-4 hover:bg-gray-800 rounded-md flex items-center transition-colors focus:outline-none flex items-center" +
            (props.currPage === 2
              ? " bg-red-500 bg-opacity-10 text-red-500"
              : " text-gray-400") +
            (props.sidebarOpen ? " w-56 pl-12" : " w-full justify-center")
          }
          onClick={() => props.setCurrPage(2)}
        >
          <BiUser className={"w-6 h-6"} />
          {props.sidebarOpen && <p className={"ml-3"}>My Page</p>}
        </button>
      </div>
      <button
        className={
          "mb-6 py-3 hover:bg-red-500 hover:bg-opacity-100 rounded-md flex items-center transition-colors focus:outline-none text-gray-400 hover:text-gray-100" +
          (props.sidebarOpen ? " w-56 pl-12" : " w-16 justify-center")
        }
        onClick={() => props.quit()}
      >
        <IoClose className="w-6 h-6" />
        {props.sidebarOpen && <p className="ml-3">Quit Monitor</p>}
      </button>
    </div>
  );
};

const MainView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const shouldAskPassword = useSelector((state) => state.ns.askPassword);
  const fatalErrors = useSelector((state) => state.ns.fatalErrors);
  const error = useSelector((state) => state.ns.error);
  const [fatalErrorOpen, setFatalErrorOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Setup NS
  useEffect(() => {
    setupListeners();
    initBackend();
  }, []);

  useEffect(() => {
    setPasswordPromptOpen(shouldAskPassword);
  }, [shouldAskPassword]);

  useEffect(() => {
    if (fatalErrors !== "") {
      setFatalErrorOpen(true);
    }
    if (error !== "") {
      setErrorOpen(true);
    }
  }, [fatalErrors, error]);

  const closeErrorModal = (_x) => {
    dispatch(setError(""));
    setErrorOpen(false);
  };

  const setCurrPage = (pageNum) => {
    setCurrentPageNum(pageNum);
    // Navigate here
    if (pageNum === 0 && currentPageNum !== 0) {
      navigate(`network`);
    } else if (pageNum === 1 && currentPageNum !== 1) {
      navigate(`settings`);
    } else if (pageNum === 2 && currentPageNum !== 2) {
      navigate(`user`);
    }
  };

  const quit = () => {
    // TODO: add exit functionality
    //appWindow.close().catch();
  };

  return (
    <div className="h-full w-full bg-opacity-0">
      {/* Password prompt*/}
      <PasswordPopup
        isOpen={passwordPromptOpen}
        setIsOpen={setPasswordPromptOpen}
      />
      {/* Fatal errors modal */}
      <ErrorModal
        isOpen={fatalErrorOpen}
        setIsOpen={setFatalErrorOpen}
        fatal={true}
      >
        <h3 className="text-xl font-bold">Fatal error occurred</h3>
        <p className="mt-2 text-red-300 font-mono select-text">{fatalErrors}</p>
      </ErrorModal>

      {/* Error modal */}
      <ErrorModal isOpen={errorOpen} setIsOpen={closeErrorModal} fatal={false}>
        <h3 className="text-xl font-bold">An error occurred</h3>
        <p className="mt-2 text-red-300 font-mono select-text">{error}</p>
      </ErrorModal>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currPage={currentPageNum}
        setCurrPage={setCurrPage}
        quit={quit}
      />
      <div className="pl-24 bg-gray-800 h-full w-screen overflow-x-hidden select-none">
        <div
          className={
            "z-10 absolute top-0 left-0 w-screen h-screen pointer-events-none backdrop-filter transition-all" +
            (sidebarOpen ? " backdrop-blur-sm" : "")
          }
        />

        <Routes>
          <Route path={`network`} element={<NetworkPage />} />
          <Route path={`settings`} element={<SettingsPage />} />
          <Route path={`user`} element={<UserPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainView;
