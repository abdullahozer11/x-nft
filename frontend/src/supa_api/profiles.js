import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const useSupaUpsertProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProfile) => {
      const { error } = await supabase.from("profiles").upsert(newProfile, {
        onConflict: ["wallet_address"],
      });
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
