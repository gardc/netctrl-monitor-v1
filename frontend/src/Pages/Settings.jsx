import React, {useEffect, useState} from "react";
import {FaSave} from "react-icons/fa";
import {IoReload} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import OkModal from "../Components/OkModal";
import rawEulaText from "../eula.txt";
import rawLicenseText from "../licenses.txt";
import {
    setBlockSleepSeconds,
    setGatewayIp,
    setGatewayMacBytes,
    setGatewayMacString,
    setLocalIface,
    setLocalIp,
    setLocalIpNet,
    setScanTimeoutSeconds,
} from "../redux/slices/nsSettings";
import {
    getDefaultLocalIp,
    getGatewayIp,
    getIfaceFromIp,
    getIpNetFromIp,
    getMacFromString,
    getVersion,
} from "../services/ns/nsFunctions";

const SettingsPage = () => {
    const nsSettings = useSelector((state) => state.ns.settings);
    const [localIpField, setLocalIpField] = useState("");
    const [gatewayIpField, setGatewayIpField] = useState("");
    const [gatewayMacField, setGatewayMacField] = useState("");
    const [scanTimeoutSecondsField, setScanTimeoutSecondsField] = useState(0);
    const [blockSleepSecondsField, setBlockSleepSecondsField] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [version, setVersion] = useState("TODO: versioning");
    const [licencesModalOpen, setLicensesModalOpen] = useState(false);
    const [eulaModalOpen, setEulaModalOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setLocalIpField(nsSettings.localIp);
        setGatewayIpField(nsSettings.gateway.ip);
        setGatewayMacField(nsSettings.gateway.mac.string);
        setScanTimeoutSecondsField(nsSettings.scanTimeoutSeconds);
        setBlockSleepSecondsField(nsSettings.blockSleepSeconds);
        getVersion().then((r) => {
            setVersion(r);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalIpField(nsSettings.localIp);
        setGatewayIpField(nsSettings.gateway.ip);
        setGatewayMacField(nsSettings.gateway.mac.string);
        setScanTimeoutSecondsField(nsSettings.scanTimeoutSeconds);
        setBlockSleepSecondsField(nsSettings.blockSleepSeconds);
    }, [nsSettings]);

    const saveSettings = () => {
        if (
            !ipv4RegexCheck(localIpField) ||
            !ipv4RegexCheck(gatewayIpField) ||
            !macRegexCheck(gatewayMacField) ||
            isNaN(scanTimeoutSecondsField) ||
            scanTimeoutSecondsField < 0 ||
            isNaN(blockSleepSecondsField) ||
            blockSleepSecondsField < 0
        ) {
            setShowErrorModal(true);
        } else {
            if (localIpField !== nsSettings.localIp) {
                dispatch(setLocalIp(localIpField));
                getIpNetFromIp(localIpField).then((r) => dispatch(setLocalIpNet(r)));
                getIfaceFromIp(localIpField).then((r) => dispatch(setLocalIface(r)));
            }
            dispatch(setGatewayIp(gatewayIpField));
            getMacFromString(gatewayMacField).then((r) =>
                dispatch(setGatewayMacBytes(r))
            );
            dispatch(setGatewayMacString(gatewayMacField));
            dispatch(setScanTimeoutSeconds(parseInt(scanTimeoutSecondsField)));
            dispatch(setBlockSleepSeconds(parseInt(blockSleepSecondsField)));
        }
    };

    const resetSettings = () => {
        getDefaultLocalIp().then(r => dispatch(setLocalIp(r)));
        getGatewayIp().then(r => dispatch(setGatewayIp(r)));
    };

    const ipv4RegexCheck = (v) => {
        return v.match("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$") != null;
    };
    const macRegexCheck = (v) => {
        return v.match("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$") != null;
    };
    // const positiveIRegexCheck = (v) => {
    //   return v.match("^[+]?\\d+([.]\\d+)?$") != null;
    // };

    const handleLocalIpChange = (e) => {
        // if (ipv4RegexCheck(e.target.value)) {
        setLocalIpField(e.target.value);
        // }
    };
    const handleGatewayIpChange = (e) => {
        // if (ipv4RegexCheck(e.target.value)) {
        setGatewayIpField(e.target.value);
        // }
    };
    const handleGatewayMacChange = (e) => {
        // if (macRegexCheck(e.target.value)) {
        setGatewayMacField(e.target.value);
        // }
    };
    const handleScanTimeoutChange = (e) => {
        // if (positiveIRegexCheck(e.target.value)) {
        setScanTimeoutSecondsField(e.target.value);
        // }
    };
    const handleBlockSleepTimeChange = (e) => {
        // if (positiveIRegexCheck(e.target.value)) {
        setBlockSleepSecondsField(e.target.value);
        // }
    };

    return (
        <>
            <div className="p-12 bg-gray-800 select-none">
                {/* Error modal */}
                <OkModal isOpen={showErrorModal} setIsOpen={setShowErrorModal}>
                    <h3 className="text-xl font-bold">Error saving settings</h3>
                    <p className="mt-2 text-gray-400">
                        Could not save settings. Please check that all fields are in a valid
                        format.
                    </p>
                </OkModal>

                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="mt-2 text-gray-400">
                    Configure NetCTRL Monitor to your needs. Only edit settings if you
                    know what you're doing. Remember to save changes made.
                </p>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Local IP Address</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Monitor will try to find your local IP address automatically,
                                but you can set it manually here. Only replace the default IP if
                                you know the IP on a different interface you wish to use.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
                                type="text"
                                value={localIpField}
                                onChange={handleLocalIpChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Local Interface name</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Monitor will try to find your default local interface, belonging
                                to your local IP address. This will change automatically with
                                local IP.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full bg-gray-800 focus:outline-none border border-gray-700 focus:ring-0"
                                type="text"
                                value={nsSettings.localIface.Name}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Default Gateway IP Address</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Monitor will try to find your default gateway address
                                automatically (router IP address), but you can set it manually
                                here. Do not replace default gateway IP unless you want to
                                target another gateway.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
                                type="text"
                                value={gatewayIpField}
                                onChange={handleGatewayIpChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Default Gateway MAC Address</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Monitor will try to find your default gateway MAC address
                                automatically (router MAC address), but you can set it manually
                                here. Do not replace default gateway MAC unless you want to
                                target another gateway.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
                                type="text"
                                value={gatewayMacField}
                                onChange={handleGatewayMacChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Scan duration</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Set the timeout duration for scan in seconds, i.e. how many
                                seconds the scan should be running.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
                                type="text"
                                value={scanTimeoutSecondsField}
                                onChange={handleScanTimeoutChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gray-900 rounded-md p-8">
                    <h4 className="text-xl font-semibold">Block aggressiveness</h4>

                    <div className="md:grid grid-cols-3 w-full">
                        <div className="md:col-span-2 md:pr-6">
                            <p className="mt-2 text-gray-400">
                                Set the number of seconds to wait before enforcing blockage to
                                target. Fewer seconds to wait means more aggressive blocking.
                            </p>
                        </div>
                        <div className="md:h-full md:flex md:items-center mt-4 md:mt-0">
                            <input
                                className="mt-1 px-3 py-2 rounded-md text-gray-400 font-mono placeholder-gray-600 text-sm font-normal w-full focus:text-gray-100 bg-gray-800 focus:outline-none border border-gray-700 focus:border-gray-400 focus:ring-0 transition"
                                type="text"
                                value={blockSleepSecondsField}
                                onChange={handleBlockSleepTimeChange}
                            />
                        </div>
                    </div>
                </div>

                <OkModal isOpen={licencesModalOpen} setIsOpen={setLicensesModalOpen}>
                    <LicenseModalContent/>
                </OkModal>
                <OkModal isOpen={eulaModalOpen} setIsOpen={setEulaModalOpen}>
                    <EulaModalContent/>
                </OkModal>

                <div className="mt-8 flex items-center">
                    <p className="text-gray-400 text-md">Version {version}</p>
                    <button
                        onClick={() => setLicensesModalOpen(true)}
                        className="ml-4 text-gray-400 text-md hover:text-red-700 hover:underline"
                    >
                        Licenses
                    </button>
                    <button
                        onClick={() => setEulaModalOpen(true)}
                        className="ml-4 text-gray-400 text-md hover:text-red-700 hover:underline"
                    >
                        EULA
                    </button>
                </div>

                <div className="mb-12"/>
            </div>
            <div
                className="py-4 fixed bg-gray-800 rounded-br-xl bottom-0 border-t border-gray-700 overflow-x-hidden"
                style={{width: "calc(100% - 6rem - 8px)"}}
            >
                <div className="px-12 flex justify-end">
                    <button
                        className="px-8 py-2 mr-2 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-600"
                        onClick={() => resetSettings()}
                    >
                        <IoReload className="mr-2 text-md"/>
                        Reset settings
                    </button>
                    <button
                        className="px-8 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-gray-600"
                        onClick={() => saveSettings()}
                    >
                        <FaSave className="mr-2"/>
                        Save settings
                    </button>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;

const LicenseModalContent = () => {
    const [licenseText, setLicenseText] = useState("");

    useEffect(() => {
        fetch(rawLicenseText)
            .then((r) => r.text())
            .then((r) => {
                setLicenseText(r);
            });
        //setLicenseText(licenses);
    }, []);

    return (
        <div className="overflow-y-scroll max-h-96">
            <p className="px-4 py-6 w-full whitespace-pre-line select-text">
                {licenseText}
            </p>
        </div>
    );
};

const EulaModalContent = () => {
    const [licenseText, setLicenseText] = useState("");

    useEffect(() => {
        fetch(rawEulaText)
            .then((r) => r.text())
            .then((r) => {
                setLicenseText(r);
            });
        //setLicenseText(licenses);
    }, []);

    return (
        <div className="overflow-y-scroll max-h-96">
            <p className="px-4 py-6 w-full whitespace-pre-line select-text">
                {licenseText}
            </p>
        </div>
    );
};
