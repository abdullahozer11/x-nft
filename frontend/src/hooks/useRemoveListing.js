import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useRemoveListing = () => {
  const queryClient = useQueryClient();
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (tokenId, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [tokenId]: isLoading,
    }));
  };

  const mutation = useMutation({
    mutationFn: async ({ tokenId, contract }) => {
      if (!contract) {
        throw new Error("Contract is not provided or not initialized");
      }
      setLoading(tokenId, true);
      try {
        const tx = await contract.removeListing(tokenId);
        console.log("Transaction:", tx);
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
        return receipt;
      } catch (error) {
        console.error("Error removing listing:", error);
        throw new Error("Failed to remove listing");
      } finally {
        setLoading(tokenId, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("listings");
    },
    onError: (error) => {
      alert("Unlisting failed");
      console.error("Mutation error:", error);
    },
  });
  return {
    ...mutation,
    isLoading: (tokenId) => !!loadingStates[tokenId],
  };
};
