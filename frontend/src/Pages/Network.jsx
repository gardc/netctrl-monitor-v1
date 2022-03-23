import { useState } from "react";
import { FaWifi } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import TargetPopup from "../Components/TargetPopup";
import { clearDevices, setIsScanning } from "../redux/slices/scanSlice";
import { scan } from "../services/ns/nsFunctions";

const tableBorderStyle = "border-b border-gray-700 ";
const tableCellStyle = "px-4 py-3 hover:py-5 transition-all ";

const NetworkPage = () => {
  const [targetOpen, setTargetOpen] = useState(false);
  const [targetDevice, setTargetDevice] = useState({});
  const isScanning = useSelector((state) => state.scan.isScanning);
  const devices = useSelector((state) => state.scan.devices);
  const nsSettings = useSelector((state) => state.ns.settings);
  const token = useSelector((state) => state.user.token);
  const pcapInitialized = useSelector((state) => state.ns.pcapInitialized);
  const dispatch = useDispatch();

  const startScan = () => {
    if (!pcapInitialized) {
      return;
    }
    scan(
      nsSettings.localIface,
      nsSettings.localIpNet,
      nsSettings.scanTimeoutSeconds,
      token
    );
    dispatch(setIsScanning(true));
  };

  const clearList = () => {
    dispatch(clearDevices());
  };

  const clickTarget = (device) => {
    setTargetDevice(device);
    setTargetOpen(true);
  };

  return (
    <div className="bg-gray-800 select-none" data-tauri-drag-region="">
      <div className="px-12 pt-12" data-tauri-drag-region="">
        <h2 className="text-2xl font-bold">Your network</h2>
        <p className="mt-2 text-gray-400">
          Scan your network to see visible devices. Click on a device to control
          it.
        </p>

        <TargetPopup
          device={targetDevice}
          open={targetOpen}
          setOpen={setTargetOpen}
        />

        <div className="mt-8 mb-24">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className={tableBorderStyle + "text-left p-4"}>
                  IP Address
                </th>
                <th className={tableBorderStyle + "text-left p-4"}>
                  MAC Address
                </th>
                <th className={tableBorderStyle + "text-left p-4"}>
                  Hostnames
                </th>
                <th className={tableBorderStyle + "text-left p-4"}>Vendor</th>
              </tr>
            </thead>

            <tbody>
              {devices.map((x) => (
                <tr
                  className="cursor-pointer hover:bg-gray-700 text-gray-300 hover:text-gray-100 transition-colors"
                  key={x.ip}
                  onClick={() => clickTarget(x)}
                >
                  <td className={tableBorderStyle + tableCellStyle}>
                    <span title="Click to control device">{x.ip}</span>
                  </td>
                  <td className={tableBorderStyle + tableCellStyle}>
                    <span title="Click to control device">{x.mac}</span>
                  </td>
                  <td className={tableBorderStyle + tableCellStyle}>
                    <span title="Click to control device">{x.hostnames}</span>
                  </td>
                  <td className={tableBorderStyle + tableCellStyle}>
                    <span title="Click to control device">{x.vendor}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="py-4 fixed bg-gray-800 rounded-br-xl bottom-0 border-t border-gray-700"
        style={{ width: "calc(100% - 6rem - 8px)" }}
      >
        <div className="px-12 flex">
          {/* Scan button */}
          {isScanning ? (
            <>
              <button
                className="px-8 py-2 bg-red-700 transition-colors rounded-md flex items-center opacity-50 focus:outline-none"
                disabled
              >
                <CgSpinnerTwoAlt className="mr-2 animate-spin" />
                Scanning
              </button>
              <button
                className="ml-2 px-6 py-2 bg-gray-700 transition-colors rounded-md flex items-center opacity-50 focus:outline-none"
                disabled
              >
                <IoReload className="mr-2" />
                Clear list
              </button>
            </>
          ) : (
            <>
              <button
                className="px-8 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-4 ring-gray-600"
                onClick={() => startScan()}
              >
                <FaWifi className="mr-2" />
                Scan network
              </button>
              <button
                className="ml-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-500"
                onClick={() => clearList()}
              >
                <IoReload className="mr-2 text-md" />
                Clear list
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
