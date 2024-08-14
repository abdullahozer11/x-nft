import "./globals.css";

import { Inter } from "next/font/google";

import { ReactQueryClientProvider } from "@/components/query_client_provider";
import { WalletProvider } from "@/context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "X-NFT Collection",
  description: "Made by Aozer",
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryClientProvider>
      <WalletProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </WalletProvider>
    </ReactQueryClientProvider>
  );
}
