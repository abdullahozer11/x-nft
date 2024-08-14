"use client";
import { ethers } from "ethers";
import React, { useState } from "react";

import { CustomLink } from "@/components/custom_link";
import { useWallet } from "@/context/WalletContext";

const NFTCard = ({
  nft,
  onPurchase,
  onList,
  onUnlist,
  listLoading,
  buyLoading,
  unlistLoading,
}) => {
  const [price, setPrice] = useState("");
  const { contract } = useWallet();

  const handleList = () => {
    onList(nft, price);
  };

  const handleUnlist = () => {
    onUnlist(nft);
  };

  const handlePurchase = () => {
    onPurchase(nft);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const buttonStyling =
    "mt-2 w-full py-3 rounded-md text-xl bg-white text-black transition " +
    "duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105 " +
    "active:bg-gray-300 active:scale-95 focus:outline-none shadow-md";

  return (
    <div className="flex flex-col flex-1 min-w-[130px] max-w-[300px] gap-7">
      <CustomLink href={`/nfts/${nft.tokenId}`} disabled={!contract}>
        <img
          className="flex-1 w-full object-cover hover:shadow-xl hover:shadow-white hover:scale-110 transition-transform"
          src={nft.image}
          alt={nft.name}
        />
      </CustomLink>
      <div className="flex flex-row flex-1 items-center justify-between gap-1">
        {nft.isOwned && nft.isActive && (
          <div className={"flex flex-col w-full"}>
            <div
              className={
                "text-center bg-white text-black text-xl rounded-md py-3"
              }
            >
              Listed for {ethers.formatEther(nft.price).toString()} ETH
            </div>
            <button
              onClick={handleUnlist}
              className={buttonStyling}
              disabled={unlistLoading}
            >
              {unlistLoading ? "Removing..." : "Remove listing"}
            </button>
          </div>
        )}
        {nft.isOwned && !nft.isActive && (
          <div className={"text-center"}>
            <input
              id="nftPrice"
              type="number"
              name="nftPrice"
              value={price}
              onChange={handlePriceChange}
              min="0"
              step="0.01"
              placeholder="Enter price in ETH"
              className="text-black rounded-md border-1 border-gray-300 w-full py-3 pl-2 text-xl"
            />
            <button
              onClick={handleList}
              className={buttonStyling}
              disabled={listLoading}
            >
              {listLoading ? "Listing..." : "List for Sale"}
            </button>
          </div>
        )}
        {!nft.isOwned && nft.isActive && (
          <>
            <button
              className="flex-1 w-full py-3 rounded-2xl text-xl bg-white text-black transition
                         duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105
                         active:bg-gray-300 active:scale-95 focus:outline-none shadow-md"
              onClick={handlePurchase}
              disabled={buyLoading}
            >
              {buyLoading ? "Purchasing..." : "Purchase"}
            </button>
            <div className="bg-yellow-300 flex-1 py-3 rounded-2xl flex-row flex items-center justify-center">
              <img
                src={"../assets/eth.png"}
                width={30}
                height={30}
                alt={"eth_icon"}
              />
              <div className="text-black font-semibold select-none">
                {ethers.formatEther(nft.price).toString()}
              </div>
            </div>
          </>
        )}
        {contract && !nft.isOwned && !nft.isActive && (
          <div className="text-gray-300 text-center flex-1 py-5 rounded-[20px] flex-row flex items-center justify-center">
            Not for sale
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
