"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
const { QueryClient } = require("@tanstack/react-query");

const queryClient = new QueryClient();

export const ReactQueryClientProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
