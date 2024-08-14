import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const useFavorites = (address) => {
  return useQuery({
    queryKey: ["favorites", address],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("profile_id", address);
      if (error) {
        console.log("useFavorites error: ", error.message);
        throw new Error(error.message);
      }
      console.log("useFavorites success: ", data);
      return data;
    },
  });
};

export const useInsertFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFavorite) => {
      const { error } = await supabase.from("favorites").insert(newFavorite);
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

export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, nftId }) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("profile_id", profileId)
        .eq("nft_id", nftId);
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
