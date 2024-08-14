const {ethers} = require("hardhat");

async function main() {
  const provider = new ethers.JsonRpcProvider();
  const {chainId} = await provider.getNetwork();

  const networkNames = {
    1: "mainnet",
    3: "ropsten",
    4: "rinkeby",
    5: "goerli",
    42: "kovan",
    1337: "ganache", // Local Ganache network
    31337: "localhost", // Local Hardhat network
  };

  const networkName = networkNames[chainId] || "unknown";

  console.log("Network chain ID:", chainId);
  console.log("Network name:", networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
