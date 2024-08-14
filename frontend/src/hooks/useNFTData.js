// hooks/useNFTData.js

import { useQuery } from "@tanstack/react-query";

const baseUri = process.env.NEXT_PUBLIC_NFT_BASE_URI;

const fetchMetadata = async (tokenId) => {
  const response = await fetch(
    `https://ipfs.io/ipfs/${baseUri}/${tokenId}.json`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNFTData = (totalSupply) => {
  const tokenIds = totalSupply
    ? Array.from({ length: totalSupply }, (_, index) => index)
    : [];

  return useQuery({
    queryKey: ["nftData"],
    queryFn: async () => {
      try {
        // Fetch metadata for each token ID
        const metadataPromises = tokenIds.map((id) => fetchMetadata(id));
        return await Promise.all(metadataPromises);
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
        throw new Error("Failed to fetch NFT data");
      }
    },
    enabled: totalSupply > 0,
  });
};
