"use client";
import { ethers } from "ethers";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { useState } from "react";

import ConnectWalletButton from "@/components/connect_wallet_button";
import { useWallet } from "@/context/WalletContext";
import { useBuyNFT } from "@/hooks/useBuyNFT";
import useListings from "@/hooks/useListings";
import { useListNFT } from "@/hooks/useListNFT";
import { useNFTData } from "@/hooks/useNFTData";
import { useOwnings } from "@/hooks/useOwnings";
import { useRemoveListing } from "@/hooks/useRemoveListing";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { mergeDicts } from "@/utils/mergeDicts";

export default function NftDetailPage() {
  const { nftTokenId } = useParams();

  const {
    contract,
    account,
    error: walletError,
    isLoading: walletLoading,
  } = useWallet();
  const {
    data: ownings,
    isLoading: owningsLoading,
    error: owningsError,
  } = useOwnings(contract, account);
  const {
    data: totalSupply,
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

  const [price, setPrice] = useState("");

  const nft = useMemo(() => {
    if (!nfts || !listings || !ownings) {
      return null;
    }
    const combined = Object.entries(mergeDicts(nfts, listings)).map(
      ([tokenId, nftAttributes]) => ({
        tokenId,
        ...nftAttributes,
      }),
    );

    combined.forEach((nft) => {
      nft.isOwned = ownings.includes(nft.tokenId);
    });

    return combined.find((item) => item.tokenId === nftTokenId) || null;
  }, [nfts, listings, ownings, nftTokenId]);

  if (
    nftsLoading ||
    listingsLoading ||
    walletLoading ||
    owningsLoading ||
    totalSupplyLoading
  ) {
    return (
      <div className="flex justify-center items-center">
        <h2>Loading NFTs...</h2>
      </div>
    );
  }

  if (
    nftsError ||
    listingsError ||
    walletError ||
    owningsError ||
    totalSupplyError
  ) {
    return (
      <div className="flex justify-center items-center">
        <h2 className="text-red-500">
          {nftsError ||
            listingsError ||
            walletError ||
            owningsError ||
            totalSupplyError}
        </h2>
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
      console.error("NFT tokenId is required to unlist");
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
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="rounded-md max-h-48 sm:max-h-64 lg:max-h-96"
                />
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
                {!nft.isOwned && !nft.isActive ? (
                  <p> Not for sale </p>
                ) : (
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
                )}
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
