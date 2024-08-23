"use client";
import { useEffect, useState } from "react";

import { useWallet } from "@/context/WalletContext";
import useListings from "@/hooks/useListings";
import useNFTData from "@/hooks/useNFTData";
import useOwnings from "@/hooks/useOwnings";
import useTotalSupply from "@/hooks/useTotalSupply";
import { useSupaFavorites } from "@/supa_api/favorites";
import { mergeDicts } from "@/utils/mergeDicts";

const useFetchNFTData = () => {
  const { contract, account } = useWallet();

  const [combinedNFTs, setCombinedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    data: ownings,
    isLoading: owningsLoading,
    error: owningsError,
  } = useOwnings(contract, account);

  const {
    data: totalSupply = 10,
    isLoading: totalSupplyLoading,
    error: totalSupplyError,
  } = useTotalSupply(contract);

  const {
    data: listings,
    isLoading: listingsLoading,
    error: listingsError,
  } = useListings(contract, totalSupply);

  const {
    data: nfts,
    error: nftsError,
    isLoading: nftsLoading,
  } = useNFTData(totalSupply);

  const {
    data: favorites,
    error: favoritesError,
    isLoading: favoritesLoading,
  } = useSupaFavorites();

  useEffect(() => {
    if (
      !nftsLoading &&
      !listingsLoading &&
      !owningsLoading &&
      !totalSupplyLoading &&
      !favoritesLoading
    ) {
      try {
        const indexedNFTs = nfts?.map((nft, id) => ({
          ...nft,
          id,
        }));

        // if not contract or account return indexedNFTs
        if (!contract || !account) {
          setCombinedNFTs(indexedNFTs);
          setLoading(false);
          return;
        }

        const combined = Object.entries(mergeDicts(indexedNFTs, listings)).map(
          ([tokenId, nftAttributes]) => ({
            tokenId,
            ...nftAttributes,
          }),
        );

        combined.forEach((nft) => {
          nft.isOwned = ownings?.includes(nft.tokenId);
        });

        combined.map((nft) => {
          nft.isFaved = !!favorites?.find((f) => f.tokenId === nft.id);
        });

        setCombinedNFTs(combined);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [
    nfts,
    listings,
    ownings,
    favorites,
    nftsLoading,
    listingsLoading,
    owningsLoading,
    totalSupplyLoading,
    favoritesLoading,
  ]);

  return {
    combinedNFTs,
    loading,
    error:
      nftsError ||
      listingsError ||
      owningsError ||
      totalSupplyError ||
      favoritesError,
  };
};

export default useFetchNFTData;
