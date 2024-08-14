"use client";
import React from "react";

import { useWallet } from "@/context/WalletContext";
import { shortenAddress } from "@/utils/address";

const ConnectWalletButton = () => {
  const { connectWallet, account, isLoading } = useWallet();

  return (
    <div className="bg-white w-40 md:w-60 lg:w-80 font-semibold text-center rounded-full text-black justify-center select-none">
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className={`w-full h-full rounded-full ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-blue-100 hover:font-semibold active:bg-blue-200"
          } font-medium transition-all duration-200 ease-in-out text-black py-5 md:py-3 lg:py-6`}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <p className={"py-3 md:py-1 lg:py-4"}>
          Connected: {shortenAddress(account)}
        </p>
      )}
    </div>
  );
};

export default ConnectWalletButton;
