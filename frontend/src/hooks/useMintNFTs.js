import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMintNFTs = (contract) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ count, mintPrice }) => {
      const tx = await contract.mintNFTs(count, { value: mintPrice });
      console.log("Transaction:", tx);
      const receipt = await tx.wait();
      console.log("Receipt:", receipt);
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("totalSupply");
      queryClient.invalidateQueries("ownings");
    },
    onError: (error) => {
      console.error("Error minting NFTs:", error);
    },
  });
};
