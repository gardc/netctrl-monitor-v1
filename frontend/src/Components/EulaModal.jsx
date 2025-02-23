import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import rawEULA from "../eula.txt";

const EulaModal = ({ isOpen, setIsOpen }) => {
  const continueButtonRef = useRef(null);
  const [eulaText, setEulaText] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetch(rawEULA)
      .then((r) => r.text())
      .then((r) => {
        setEulaText(r);
      });
  }, []);

  function submitted(e) {
    e.preventDefault();

    if (agreed) {
      localStorage.setItem("eulaAgreed", "true");
      setIsOpen(false);
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-40 inset-0 overflow-y-auto"
        onClose={() => {}}
        initialFocus={continueButtonRef}
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
            <div className="inline-block bg-gray-700 text-gray-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-7 py-6">
                <h3 className="text-xl font-bold">
                  Required license agreement
                </h3>
                <p className="mt-2 bg-gray-800 max-h-96 overflow-y-scroll px-4 py-6 w-full whitespace-pre-line select-text">
                  {eulaText}
                </p>
                <form
                  onSubmit={submitted}
                >
                  <div className="mt-2 flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="agree"
                      className="rounded cursor-pointer bg-gray-800 border focus:border-gray-700 border-gray-700 text-red-600 focus:outline-none ring-0 focus:ring-2 focus:ring-red-400 focus:ring-offset-0 focus:ring-opacity-50 transition"
                      checked={agreed}
                      onChange={(e) => setAgreed(!agreed)}
                      required
                    />
                    <label for="agree" className="ml-2 text-gray-300">
                      I acknowledge that I have read and agree to the above
                      license agreement
                    </label>
                  </div>

                  {/* Buttons section */}
                  <div className="">
                    <div className="flex justify-end">
                      <input
                        type="submit"
                        className="px-8 cursor-pointer py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-md flex items-center focus:outline-none focus:ring-2 ring-red-500"
                        ref={continueButtonRef}
                        value="Continue"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EulaModal;
