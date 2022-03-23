import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ErrorModal = ({ children, isOpen, setIsOpen, fatal = false }) => {
  const okButtonRef = useRef(null);

  const exit = () => {
    // TODO: add exit functionality
    //appWindow.close().then();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={fatal ? () => exit : () => setIsOpen(false)}
        initialFocus={okButtonRef}
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity rounded-xl" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

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
            <div className="inline-block bg-gray-700 text-gray-100 border border-red-600 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-7 py-6">
                {children}
                <p className="mt-2 text-gray-400">
                  If you believe this is the programs fault, please report the
                  error to customer support.
                </p>
              </div>
              {/* Buttons section */}
              <div className="bg-gray-800 px-7 py-4 border-t border-gray-600">
                <div className="flex justify-end">
                  <button
                    className="px-8 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-red-500"
                    onClick={fatal ? () => exit() : () => setIsOpen(false)}
                    ref={okButtonRef}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ErrorModal;
