import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const useListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*");
      if (error) {
        console.log("useListings error: ", error.message);
        throw new Error(error.message);
      }
      console.log("useListings success: ", data);
      return data;
    },
  });
};

export const useProfileListings = (address, isActive) => {
  return useQuery({
    queryKey: ["profileListings", address, isActive],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_address", address)
        .eq("is_active", isActive);
      if (error) {
        console.log("useProfileListings error: ", error.message);
        throw new Error(error.message);
      }
      console.log("useProfileListings success: ", data);
      return data;
    },
  });
};

export const useInsertListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newListing) => {
      const { error } = await supabase.from("listings").insert(newListing);
      if (error) {
        console.log("useInsertListing error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("listing_id", listingId);
      if (error) {
        console.log("useDeleteListing error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, updatedData }) => {
      const { error } = await supabase
        .from("listings")
        .update(updatedData)
        .eq("listing_id", listingId);
      if (error) {
        console.log("useUpdateListing error: ", error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
    },
  });
};
