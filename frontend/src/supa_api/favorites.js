import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useWallet } from "@/context/WalletContext";
import { supabase } from "@/lib/supabaseClient";

export const useSupaFavorites = (address) => {
  const { account: ctxAddress } = useWallet();
  if (!address) {
    address = ctxAddress;
  }
  return useQuery({
    queryKey: ["favorites", address],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("walletAddress", address);
      if (error) {
        console.log("useFavorites error: ", error.message);
        throw new Error(error.message);
      }
      console.log("useFavorites success: ", data);
      return data;
    },
  });
};

export const useSupaInsertFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, walletAddress, contractAddress }) => {
      const { error } = await supabase.from("favorites").insert({
        tokenId,
        walletAddress,
        contractAddress,
      });
      if (error) {
        console.log("useInsertFavorite error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });
};

export const useSupaDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ walletAddress, tokenId, contractAddress }) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("walletAddress", walletAddress)
        .eq("contractAddress", contractAddress)
        .eq("tokenId", tokenId);
      if (error) {
        console.log("useDeleteFavorite error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });
};
