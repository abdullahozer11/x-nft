import { useQuery } from "@tanstack/react-query";

export const useOwnings = (contract, owner) => {
  return useQuery({
    queryKey: ["ownings", owner],
    queryFn: async () => {
      try {
        const ownings = await contract.tokensOfOwner(owner);

        // Convert each BigInt in the array to a string
        const owningsStrings = ownings.map((bigInt) => bigInt.toString());

        // console.log(`Ownings for owner (${owner}): ${owningsStrings}`);
        return owningsStrings;
      } catch (error) {
        console.error(`Error fetching ownings for owner ${owner}:`, error);
        return []; // Optionally return an empty array or handle the error as needed
      }
    },
    enabled: !!contract,
  });
};
