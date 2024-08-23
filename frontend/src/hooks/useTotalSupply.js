import { useQuery } from "@tanstack/react-query";

const useTotalSupply = (contract) => {
  return useQuery({
    queryKey: ["totalSupply"],
    queryFn: async () => {
      try {
        const totalSupply = await contract.totalSupply();
        // console.log("Total Supply:", totalSupply.toString());
        return Number(totalSupply);
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    },
    enabled: !!contract,
  });
};

export default useTotalSupply;
