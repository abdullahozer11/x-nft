// FavoriteButton.jsx
import React from "react";
import * as Icon from "react-feather";

import { useWallet } from "@/context/WalletContext";
import {
  useSupaDeleteFavorite,
  useSupaInsertFavorite,
} from "@/supa_api/favorites";

const FavoriteButton = ({ nft }) => {
  const { mutate: deleteFavorite } = useSupaDeleteFavorite();
  const { mutate: insertFavorite } = useSupaInsertFavorite();
  const { account, contract } = useWallet();
  return (
    <button
      disabled={!contract}
      className="absolute top-2 right-2 text-5xl text-red-500 hover:text-red-600 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        if (nft.isFaved) {
          deleteFavorite({
            walletAddress: account,
            tokenId: nft.tokenId,
            contractAddress: contract?.target,
          });
        } else {
          insertFavorite({
            walletAddress: account,
            tokenId: nft.tokenId,
            contractAddress: contract?.target,
          });
        }
      }}
    >
      <Icon.Heart
        fill={nft.isFaved ? "currentColor" : "none"}
        stroke="red"
        strokeWidth="2"
        className={"w-10 h-10 transform transition-transform hover:scale-110"}
      />
    </button>
  );
};

export default FavoriteButton;
