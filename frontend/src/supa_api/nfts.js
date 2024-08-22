import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const useSupaNFTs = () => {
  return useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nfts").select("*");
      if (error) {
        console.log("useNFTs error: ", error.message);
        throw new Error(error.message);
      }
      console.log("useNFTs success: ", data);
      return data;
    },
  });
};

export const useSupaInsertNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNFT) => {
      const { error } = await supabase.from("nfts").insert(newNFT);
      if (error) {
        console.log("useInsertNFT error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["nfts"]);
    },
  });
};

export const useSupaDeleteNFT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokenId) => {
      const { error } = await supabase
        .from("nfts")
        .delete()
        .eq("token_id", tokenId);
      if (error) {
        console.log("useDeleteNFT error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["nfts"]);
    },
  });
};
