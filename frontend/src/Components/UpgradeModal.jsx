import React, { useRef } from "react";
import { GoCheck } from "react-icons/go";
import remoteUrlBase from "../lib/remoteUrlBase";
import GrayButton from "./GrayButton";
import ModalBase from "./ModalBase";
import RedButton from "./RedButton";
import { BiTimer } from "react-icons/bi";

function BulletPoint(props) {
  return (
    <div className="mt-1 text-gray-200">
      <p className="">
        <GoCheck className="text-2xl inline-block mr-2" />
        {props.children}
      </p>
    </div>
  );
}

function ComingSoonPoint(props) {
  return (
    <div className="mt-1 text-gray-200">
      <p className="">
        <BiTimer className="text-2xl inline-block mr-2" />
        {props.children}
        <span className="ml-2 text-xs text-gray-100 bg-red-300 bg-opacity-25 px-1 py-0.5 rounded-md opacity-60">
          Coming soon
        </span>
      </p>
    </div>
  );
}

export default function UpgradeModal({ isOpen, setIsOpen }) {
  const initFocusRef = useRef();
  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      initialFocusRef={initFocusRef}
    >
      <div className="px-7 pt-10 pb-4 flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold">
          Become a NetCTRL{" "}
          <span className="mx-0.5 px-2 py-1 bg-red-600 rounded-md shadow-lg shadow-red-600/50">
            Pro
          </span>{" "}
          Member
        </h1>
        <p className="mt-4 text-gray-200">
          NetCTRL Pro is required to access this feature. Upgrading to NetCTRL
          Pro gives you the following benefits:
        </p>
        <div className="flex flex-col mt-2 justify-start items-start">
          <BulletPoint>Unlimited network scans</BulletPoint>
          <BulletPoint>Access to the <span className="px-1.5 py-0.5 rounded-md bg-red-600 bg-opacity-75">Block connection</span> feature</BulletPoint>
          <BulletPoint>Unlimited access to all Monitor features</BulletPoint>
          <BulletPoint>Up to 3 devices with access to Monitor</BulletPoint>
          <ComingSoonPoint>Monitor device's network traffic</ComingSoonPoint>
          <ComingSoonPoint>Lag-device feature</ComingSoonPoint>
          <ComingSoonPoint>Edit and save device names</ComingSoonPoint>
          <ComingSoonPoint>Automatic scans</ComingSoonPoint>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Already upgraded? Restart the app for the upgrade to take effect.
        </p>
      </div>
      <div className="bg-gray-800 px-7 py-4 border-t border-gray-600">
        <div className="flex justify-end">
          <GrayButton onClick={() => setIsOpen(false)}>Close</GrayButton>
          <RedButton
            onClick={() => window.runtime.BrowserOpenURL(`${remoteUrlBase()}/user/upgrade`)}
            ref={initFocusRef}
          >
            Check it out!
          </RedButton>
        </div>
      </div>
    </ModalBase>
  );
}
