"use client";
import { ethers } from "ethers";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import ConnectWalletButton from "@/components/connect_wallet_button";
import FavoriteButton from "@/components/FavoriteButton";
import { useWallet } from "@/context/WalletContext";
import { useBuyNFT } from "@/hooks/useBuyNFT";
import useFetchNFTData from "@/hooks/useFetchNFTData";
import { useListNFT } from "@/hooks/useListNFT";
import { useRemoveListing } from "@/hooks/useRemoveListing";

export default function NftDetailPage() {
  const { nftTokenId } = useParams();
  const [price, setPrice] = useState("");
  const { contract } = useWallet();
  const { combinedNFTs: nfts, loading, error } = useFetchNFTData();
  const { mutate: buyNFT, isLoading: buyLoading } = useBuyNFT(contract);
  const { mutate: listNFT, isLoading: listLoading } = useListNFT(contract);
  const { mutate: unlistNFT, isLoading: unlistLoading } =
    useRemoveListing(contract);

  const nft = nfts[nftTokenId];

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
        <h2 className="text-red-500">{error}</h2>
      </div>
    );
  }

  const handlePurchase = async (nft) => {
    if (!nft?.tokenId) {
      console.error("NFT tokenId is required to purchase");
      return;
    }
    await buyNFT({
      tokenId: nft.tokenId,
      priceInWei: nft.price,
    });
  };

  const handleUnlist = async (nft) => {
    if (!nft?.tokenId) {
      console.error("NFT tokenId is required to unlist");
      return;
    }
    await unlistNFT({ tokenId: nft.tokenId });
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

    const priceInWei = ethers.parseUnits(price.toString(), "ether");
    await listNFT({ tokenId: nft.tokenId, priceInWei });
  };

  const handleAction = async () => {
    if (nft.isOwned && nft.isActive) {
      await handleUnlist(nft);
    } else if (nft.isOwned) {
      await handleList(nft, price);
    } else {
      await handlePurchase(nft);
    }
  };

  const renderButtonLabel = () => {
    if (nft.isOwned && nft.isActive) {
      return unlistLoading(nftTokenId) ? "Unlisting..." : "Unlist NFT";
    } else if (nft.isOwned) {
      return listLoading(nftTokenId) ? "Listing..." : "List NFT";
    } else {
      return buyLoading(nftTokenId) ? "Buying..." : "Buy NFT";
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen overflow-hidden bg-gray-900">
      {/* Top Bar */}
      <div
        className="bg-black sm:flex-row p-2 sm:p-5 text-white font-semibold text-xs sm:text-md
    md:text-xl lg:text-3xl flex flex-row justify-around items-center w-full sm:w-auto"
      >
        <Link href="/">
          <button className="hover:scale-110">HOME</button>
        </Link>
        <Link href="/about">
          <button className="hover:scale-110 ml-4 sm:ml-10">ABOUT</button>
        </Link>
        <ConnectWalletButton className="ml-4 sm:ml-10" />
      </div>

      {/* NFT Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-white p-5 sm:p-10 bg-gray-900">
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
          <p className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold font-sans select-none text-center mb-4">
            {nft?.name}
          </p>
          {nft ? (
            <div className="flex flex-col lg:flex-row items-center justify-center bg-gray-800 p-3 sm:p-5 rounded-lg shadow-lg w-full lg:w-1/2">
              <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-5">
                <div className="relative">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="rounded-md max-h-48 sm:max-h-64 lg:max-h-96"
                  />
                  {contract && <FavoriteButton nft={nft} />}
                </div>
              </div>
              <div className="flex flex-col justify-between text-center lg:text-left">
                <p className="text-sm sm:text-md md:text-lg lg:text-xl mt-2">
                  {nft.description}
                </p>
                <div className="traits mt-2">
                  {nft.attributes.map((attr) => {
                    const levelClass = {
                      low: "bg-red-500 w-1/4",
                      medium: "bg-yellow-500 w-1/2",
                      high: "bg-blue-500 w-3/4",
                      "very high": "bg-green-500 w-full",
                    };

                    return (
                      <div key={attr.trait_type} className="mb-2">
                        <span className="font-bold text-gray-400">
                          {attr.trait_type}:
                        </span>{" "}
                        {attr.value}
                        <div className="trait-level-bar h-2 mt-1">
                          <div
                            className={`${levelClass[attr.value.toLowerCase()]} h-full`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {nft.isActive && (
                  <div
                    className={
                      "text-center bg-white text-black rounded py-2 select-none"
                    }
                  >
                    Listed for {ethers.formatEther(nft.price).toString()} ETH
                  </div>
                )}
                {nft.isOwned && !nft.isActive && (
                  <div className="mt-5 flex flex-col">
                    <input
                      className="text-black p-2 rounded"
                      type="number"
                      name="nftPrice"
                      min="0"
                      step="0.01"
                      placeholder="Enter price in ETH"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}
                {contract && !nft.isOwned && !nft.isActive ? (
                  <p> Not for sale </p>
                ) : contract ? (
                  <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAction}
                    disabled={
                      unlistLoading(nftTokenId) ||
                      buyLoading(nftTokenId) ||
                      listLoading(nftTokenId)
                    }
                  >
                    {renderButtonLabel()}
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="text-white text-center mt-10">
              <p>NFT not found or data is unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
