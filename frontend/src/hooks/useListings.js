import { useQuery } from "@tanstack/react-query";

const useListings = (contract, totalSupply) => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        let listings = {};
        for (let i = 0; i < totalSupply; i++) {
          try {
            const listing = await contract.listings(i);
            listings[i] = {
              price: listing[0],
              seller: listing[1],
              isActive: listing[2],
            };
          } catch (error) {
            console.error(`Error fetching listing for Token ID ${i}:`, error);
          }
        }
        // console.log("listings are ", listings);
        return listings;
      } catch (error) {
        console.error("Error fetching total supply:", error);
        throw new Error("Failed to fetch listings");
      }
    },
    enabled: !!contract && !!totalSupply,
  });
};

export default useListings;
