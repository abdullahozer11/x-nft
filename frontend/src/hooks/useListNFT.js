import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useListNFT = (contract) => {
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
        const tx = await contract.listNFT(tokenId, priceInWei);
        console.log("Transaction:", tx);
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error;
      } finally {
        setLoading(tokenId, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
    },
    onError: (error) => {
      alert("Listing failed");
      console.error("Error listing NFT:", error);
    },
  });

  return {
    ...mutation,
    isLoading: (tokenId) => !!loadingStates[tokenId],
  };
};
