import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReserveNFTs = (contract) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ count }) => {
      const tx = await contract.reserveNFTs(count);
      console.log("Transaction:", tx);
      const receipt = await tx.wait();
      console.log("Receipt:", receipt);
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("listings");
      queryClient.invalidateQueries("totalSupply");
    },
    onError: () => {
      alert("Failed to reserve NFTs");
    },
  });
};
