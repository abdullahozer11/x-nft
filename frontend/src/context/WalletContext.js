"use client";
import { ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import NFTCollection from "@/contracts/NFTCollection.json";
import { useSupaUpsertProfile } from "@/supa_api/profiles";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {mutate: upsertProfile} = useSupaUpsertProfile();

  const getContractAddress = async (chainId) => {
    switch (Number(chainId)) {
      case parseInt(process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID, 16): // SEPOLIA
        return process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS;
      case parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID, 16): // hardhat
        return process.env.NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS;
      default:
        return null;
    }
  };

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum == null) {
      alert("Install MetaMask");
      console.log("MetaMask not installed; using read-only defaults");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      upsertProfile({
        wallet_address: userAddress,
      });

      // Fetch current chain ID
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      window.chainId = chainId;

      // Get the correct contract address for the current chain ID
      const contractAddress = await getContractAddress(chainId);

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      const contractInstance = new ethers.Contract(
        contractAddress,
        NFTCollection.abi,
        signer,
      );

      setAccount(userAddress);
      setContract(contractInstance);
    } catch (err) {
      const msg = "Something went wrong.";
      console.log(msg, err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const newAccount = accounts[0];
        setAccount(newAccount);
        upsertProfile({
          wallet_address: newAccount,
        });

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          const chainId = network.chainId;
          const contractAddress = await getContractAddress(chainId);

          if (!contractAddress) {
            throw new Error("Unsupported network");
          }

          const contractInstance = new ethers.Contract(
            contractAddress,
            NFTCollection.abi,
            signer,
          );

          setContract(contractInstance);
        } catch (err) {
          console.error(
            "Failed to reinitialize contract with new account",
            err,
          );
          setError("Failed to reinitialize contract with new account.");
        }
      } else {
        setAccount(null);
        setContract(null);
      }
    };

    const handleChainChanged = async () => {
      checkIfWalletIsConnected();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      setError(null);
    }
  }, [account]);

  return (
    <WalletContext.Provider
      value={{
        account,
        contract,
        error,
        isLoading,
        connectWallet: checkIfWalletIsConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
