import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const useSupaUpsertProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ walletAddress, contractAddress }) => {
      const { error } = await supabase.from("profiles").upsert(
        { walletAddress, contractAddress },
        {
          onConflict: ["walletAddress", "contractAddress"],
        },
      );
      if (error) {
        console.log("useInsertProfile error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profiles"]);
    },
  });
};
