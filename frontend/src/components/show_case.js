"use client";
import { ethers } from "ethers";
import React, { useMemo } from "react";

import NFTCard from "@/components/nft_card";
import { useWallet } from "@/context/WalletContext";
import { useBuyNFT } from "@/hooks/useBuyNFT";
import useListings from "@/hooks/useListings";
import { useListNFT } from "@/hooks/useListNFT";
import { useNFTData } from "@/hooks/useNFTData";
import { useOwnings } from "@/hooks/useOwnings";
import { useRemoveListing } from "@/hooks/useRemoveListing";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { mergeDicts } from "@/utils/mergeDicts";

const ShowCase = () => {
  const { contract, account } = useWallet();
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

  const { mutate: buyNFT, isLoading: buyLoading } = useBuyNFT(contract);
  const { mutate: listNFT, isLoading: listLoading } = useListNFT(contract);
  const { mutate: unlistNFT, isLoading: unlistLoading } =
    useRemoveListing(contract);

  const combinedNFTs = useMemo(() => {
    if (!nfts) {
      return [];
    }
    if (!listings || !ownings) {
      return nfts;
    }
    const combined = Object.entries(mergeDicts(nfts, listings)).map(
      ([tokenId, nftAttributes]) => ({
        tokenId,
        ...nftAttributes,
      }),
    );

    // Add 'isOwned' attribute based on ownings list
    combined.forEach((nft) => {
      nft.isOwned = ownings.includes(nft.tokenId);
    });

    return combined;
  }, [nfts, listings, ownings]);

  if (nftsLoading || listingsLoading || owningsLoading || totalSupplyLoading) {
    return (
      <div className="flex justify-center items-center">
        <h2>Loading NFTs...</h2>
      </div>
    );
  }

  if (nftsError || listingsError || owningsError || totalSupplyError) {
    return (
      <div className="flex justify-center items-center">
        <h2 className={"text-red-500"}>{nftsError || listingsError}</h2>
      </div>
    );
  }

  const handlePurchase = async (nft) => {
    if (!nft?.tokenId) {
      console.error("NFT tokenId is required to purchase");
      return;
    }
    try {
      await buyNFT({
        tokenId: nft.tokenId,
        priceInWei: nft.price,
      });
      // console.log("NFT purchase request sent successfully");
    } catch (err) {
      console.error("Error purchasing NFT:", err);
    }
  };

  const handleUnlist = async (nft) => {
    if (!nft?.tokenId) {
      console.error("NFT tokenId is required to list");
      return;
    }

    try {
      await unlistNFT({ tokenId: nft.tokenId });
      // console.log("NFT unlist request sent successfully");
    } catch (err) {
      console.error("Error unlisting NFT:", err);
    }
  };

  const handleList = async (nft, price) => {
    if (!nft?.tokenId) {
      console.error("NFT tokenId is required to list");
      return;
    }

    if (!price) {
      console.error("Price is required to list");
      return;
    }

    if (price <= 0) {
      console.error("Price must be a positive number");
      return;
    }

    try {
      const priceInWei = ethers.parseUnits(price.toString(), "ether");
      await listNFT({ tokenId: nft.tokenId, priceInWei });
      // console.log("NFT list request sent successfully");
    } catch (err) {
      console.error("Error listing NFT:", err);
    }
  };

  return (
    <div className={"flex justify-center items-center my-10 md:my-20 mx-20"}>
      {/*carousel*/}
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {combinedNFTs?.map((nft) => (
          <NFTCard
            key={nft.tokenId ?? nft.name}
            nft={nft}
            onPurchase={handlePurchase}
            onList={handleList}
            onUnlist={handleUnlist}
            listLoading={listLoading(nft.tokenId)}
            buyLoading={buyLoading(nft.tokenId)}
            unlistLoading={unlistLoading(nft.tokenId)}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowCase;
