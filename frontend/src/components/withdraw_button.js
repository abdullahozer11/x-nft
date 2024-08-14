"use client";
import React from "react";

import { useWallet } from "@/context/WalletContext";
import { useWithdraw } from "@/hooks/useWithdraw";

const WithdrawButton = () => {
  const {
    contract,
    isLoading: walletLoading,
    error: walletError,
  } = useWallet();
  const { mutate: withdraw, isLoading } = useWithdraw(contract);

  if (walletLoading) {
    return null;
  }

  if (walletError) {
    return <div>Error</div>;
  }

  const handleWithdraw = () => {
    withdraw();
  };

  return (
    <div
      className={
        "bg-white w-40 md:w-60 lg:w-80 font-semibold text-center py-5 md:py-3 lg:py-6 rounded-full text-black justify-center"
      }
    >
      <button onClick={handleWithdraw} disabled={isLoading}>
        {isLoading ? "Withdrawing..." : "Withdraw funds"}
      </button>
    </div>
  );
};

export default WithdrawButton;
