import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useWithdraw = (contract) => {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const tx = await contract.withdraw();
        console.log("Transaction:", tx);
        const receipt = await tx.wait();
        console.log("Receipt:", receipt);
        return receipt;
      } catch (e) {
        console.error("Transaction error:", e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      alert("Withdraw error");
      console.error("Error withdrawing NFTs:", error);
    },
  });

  return {
    ...mutation,
    isLoading,
  };
};
