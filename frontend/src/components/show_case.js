"use client";
import { ethers } from "ethers";

import NFTCard from "@/components/nft_card";
import { useBuyNFT } from "@/hooks/useBuyNFT";
import useFetchNFTData from "@/hooks/useFetchNFTData";
import { useListNFT } from "@/hooks/useListNFT";
import { useRemoveListing } from "@/hooks/useRemoveListing";

const ShowCase = () => {
  const { combinedNFTs, loading, error } = useFetchNFTData();
  const { mutate: buyNFT, isLoading: buyLoading } = useBuyNFT();
  const { mutate: listNFT, isLoading: listLoading } = useListNFT();
  const { mutate: unlistNFT, isLoading: unlistLoading } = useRemoveListing();

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <h2>Loading NFTs...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <h2 className={"text-red-500"}>{error.message}</h2>
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
            key={nft.tokenId ?? nft.id}
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
