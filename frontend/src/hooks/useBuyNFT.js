import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useWallet } from "@/context/WalletContext";

export const useBuyNFT = (contract) => {
  const { ctxContract: ctxContract } = useWallet();
  if (!contract) {
    contract = ctxContract;
  }

  const queryClient = useQueryClient();
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (tokenId, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [tokenId]: isLoading,
    }));
  };

  const mutation = useMutation({
    mutationFn: async ({ tokenId, priceInWei }) => {
      setLoading(tokenId, true);
      try {
        const tx = await contract.buyNFT(tokenId, { value: priceInWei });
        console.log("Transaction:", tx);
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("Error estimating gas or sending transaction:", error);
        throw error;
      } finally {
        setLoading(tokenId, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
      queryClient.invalidateQueries(["ownings"]);
    },
    onError: (error) => {
      alert("Purchase failed");
      console.error("Error buying NFT:", error);
    },
  });

  return {
    ...mutation,
    isLoading: (tokenId) => !!loadingStates[tokenId],
  };
};
