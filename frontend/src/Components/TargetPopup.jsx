import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { ImBlocked } from "react-icons/im";
import { IoMdPower } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setIsBlocking } from "../redux/slices/blockSlice";
import { block, unblock } from "../services/ns/nsFunctions";
import UpgradeModal from "./UpgradeModal";

const TargetPopup = ({ device, open, setOpen }) => {
  const isScanning = useSelector((state) => state.scan.isScanning);
  const isBlocking = useSelector((state) => state.block.isBlocking);
  const gatewayIp = useSelector((state) => state.ns.settings.gatewayIp);
  const gatewayMac = useSelector((state) => state.ns.settings.gatewayMac);
  const nsSettings = useSelector((state) => state.ns.settings);
  const pcapInitialized = useSelector((state) => state.ns.pcapInitialized);
  const proUser = useSelector((state) => state.user.proUser);
  const token = useSelector((state) => state.user.token);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const dispatch = useDispatch();

  const cancelButtonRef = useRef(null);

  const startBlock = () => {
    if (!proUser) {
      setUpgradeModalOpen(true);
      return;
    }
    if (isScanning || isBlocking || !pcapInitialized) {
      return;
    }
    block(
      device,
      nsSettings.localIface,
      nsSettings.gateway,
      nsSettings.blockSleepSeconds,
      token
    );
    dispatch(setIsBlocking(true));
  };

  const closeOverlay = (e) => {
    if (isBlocking) {
      unblock(device, nsSettings.localIface, nsSettings.gateway, token);
    }
    setOpen(false);
  };

  const renderBlockButton = () => {
    if (isScanning) {
      return (
        <button
          className="px-8 py-2 bg-red-700 transition-colors rounded-md flex items-center opacity-50 focus:outline-none"
          disabled
        >
          <span
            className="flex items-center"
            title="Wait until scan is finished"
          >
            <CgSpinnerTwoAlt className="mr-2 animate-spin" />
            Waiting for scan
          </span>
        </button>
      );
    } else if (isBlocking) {
      return (
        <button
          className="px-8 py-2 bg-red-700 transition-colors rounded-md flex items-center opacity-50 focus:outline-none"
          disabled
        >
          <span
            className="flex items-center"
            title="Press Cancel to stop blocking"
          >
            <CgSpinnerTwoAlt className="mr-2 animate-spin" />
            Blocking
          </span>
        </button>
      );
    } else if (device.ip === gatewayIp && device.mac === gatewayMac) {
      return (
        <button
          className="px-8 py-2 bg-red-700 transition-colors rounded-md flex items-center opacity-50 focus:outline-none"
          disabled
        >
          <span className="flex items-center" title="Cannot block gateway">
            <ImBlocked className="mr-2 " />
            Block connection
          </span>
        </button>
      );
    } else {
      return (
        <button
          className="px-8 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-red-500"
          onClick={() => startBlock()}
        >
          <IoMdPower className="mr-2" />
          Block connection
        </button>
      );
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-30 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeOverlay}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 select-none">
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-out duration-200"
            leaveFrom="opacity-100"
            leaveto="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity " />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* Upgrade window */}
          <UpgradeModal isOpen={upgradeModalOpen} setIsOpen={setUpgradeModalOpen} />

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {/* Content */}
            <div className="inline-block bg-gray-700 text-gray-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-7 py-6">
                <h3 className="text-xl font-bold">Manage device</h3>
                <p className="mt-0 text-gray-400">
                  Here you can control the device's internet connectivity by
                  temporarily blocking it.
                </p>
                <div className="mt-2 grid grid-cols-2">
                  {/* Left side */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <DeviceDataTitle>Local IP Address</DeviceDataTitle>
                      <DeviceDataField>{device.ip}</DeviceDataField>
                    </div>
                    <div className="flex flex-col">
                      <DeviceDataTitle>MAC Address</DeviceDataTitle>
                      <DeviceDataField>{device.mac}</DeviceDataField>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <DeviceDataTitle>Hostnames</DeviceDataTitle>
                      <DeviceDataField>{device.hostnames}</DeviceDataField>
                    </div>
                    <div className="flex flex-col">
                      <DeviceDataTitle>Device vendor</DeviceDataTitle>
                      <DeviceDataField>{device.vendor}</DeviceDataField>
                    </div>
                  </div>
                </div>
              </div>
              {/* Buttons section */}
              <div className="bg-gray-800 px-7 py-4 border-t border-gray-600">
                <div className="flex justify-end">
                  {/* Cancel button */}
                  <button
                    className="px-8 py-2 mr-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-500"
                    onClick={() => closeOverlay()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  {renderBlockButton()}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TargetPopup;

const DeviceDataTitle = (props) => {
  return <b className="font-bold mt-2">{props.children}</b>;
};

const DeviceDataField = (props) => {
  return (
    <p className="text-gray-400 font-mono text-sm select-text">
      {props.children}
    </p>
  );
};
