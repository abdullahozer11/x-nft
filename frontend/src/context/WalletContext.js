"use client";
import { ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";

import NFTCollection from "@/contracts/NFTCollection.json";
import { useSupaUpsertProfile } from "@/supa_api/profiles";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: upsertProfile } = useSupaUpsertProfile();

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

      // Fetch current chain ID
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      // Get the correct contract address for the current chain ID
      const contractAddress = await getContractAddress(chainId);

      if (!contractAddress) {
        throw new Error("Unsupported network");
      }

      upsertProfile(
        { walletAddress: userAddress, contractAddress },
        {
          onSuccess: async () => {
            console.log("Successfully upserted profile");
          },
          onError: (error) => {
            console.error("Server error:", error);
            Alert.alert("Error", "Server error.");
          },
        },
      );

      const contractInstance = new ethers.Contract(
        contractAddress,
        NFTCollection.abi,
        signer,
      );

      setAccount(userAddress);
      setContract(contractInstance);
    } catch (err) {
      const msg = "Something went wrong.";
      console.error(msg, err);
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
        upsertProfile(
          {
            walletAddress: newAccount,
            contractAddress: contract?.target,
          },
          {
            onSuccess: async () => {
              console.log("Successfully upserted profile");
            },
            onError: (error) => {
              console.error("Server error:", error);
              Alert.alert("Error", "Server error.");
            },
          },
        );

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
        }
      } else {
        setAccount(null);
        setContract(null);
      }
    };

    const handleChainChanged = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (
        parseInt(process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID, 16) !==
          network.chainId ||
        parseInt(process.env.NEXT_PUBLIC_HARDHAT_CHAIN_ID, 16) !==
          network.chainId
      ) {
        setAccount(null);
        setContract(null);
        console.log("Network changed, resetting wallet context");
      } else {
        checkIfWalletIsConnected();
      }
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

  return (
    <WalletContext.Provider
      value={{
        account,
        contract,
        isLoading,
        connectWallet: checkIfWalletIsConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
