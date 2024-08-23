import Link from "next/link";

import ConnectWalletButton from "@/components/connect_wallet_button";
import ShowCase from "@/components/show_case";

export default function Home() {
  return (
    // container
    <div className="bg-black flex flex-col w-full h-full min-h-screen overflow-hidden">
      {/*header*/}
      <div className="text-white font-semibold sm:text-md md:text-xl lg:text-3xl mt-10 flex flex-row justify-around items-center">
        <Link href="/about">
          <button className="hover:scale-110">ABOUT</button>
        </Link>
        <p className={"select-none"}>Sepolia Testnet</p>
        <ConnectWalletButton />
      </div>
      {/*hero*/}
      <div className="text-white text-center flex justify-center items-center mt-10 flex flex-col gap-5">
        <text
          className={
            "text-3xl md:text-5xl lg:text-7xl font-bold font-sans select-none"
          }
        >
          X-NFT COLLECTION
        </text>
        <text
          className={"text-2xl md:text-3xl lg:text-4xl font-normal select-none"}
        >
          Trade apojean.eth NFTs
        </text>
      </div>
      {/*content*/}
      <ShowCase />
    </div>
  );
}
