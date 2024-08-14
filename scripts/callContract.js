// scripts/callContract.js

const { ethers } = require("hardhat");
require('dotenv').config();
const path = require('path');

async function main() {
  const contractAddress = process.env.HARDHAT_CONTRACT_ADDRESS;
  const owner = process.env.HARDHAT_WALLET_ADDRESS;

  // Load the contract ABI from the artifacts folder
  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/NFTCollection.sol/NFTCollection.json');
  const contractArtifact = require(artifactPath);
  const contractABI = contractArtifact.abi;

  // Get a signer instance
  const [signer] = await ethers.getSigners();

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const contractOwner = await contract.owner();
    console.log("Contract Owner:", contractOwner);

    const totalMinted = await contract.totalSupply();
    console.log("Current Number of NFTs Minted:", totalMinted.toString());

    const maxSupply = await contract.MAX_SUPPLY();
    const maxPerMint = await contract.MAX_PER_MINT();
    const price = await contract.PRICE();
    const tokensOfOwner = await contract.tokensOfOwner(owner);
    const baseTokenURI = await contract.baseTokenURI();

    console.log("MAX_SUPPLY:", maxSupply.toString());
    console.log("MAX_PER_MINT:", maxPerMint.toString());
    console.log("PRICE:", ethers.formatEther(price));
    console.log("Tokens of Owner:", tokensOfOwner);
    console.log("Base Token URI:", baseTokenURI);
  } catch (error) {
    console.error("Error calling function:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
