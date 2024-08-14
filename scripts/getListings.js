// scripts/callContract.js

const {ethers} = require("hardhat");
require('dotenv').config();
const path = require('path');

async function main() {
  const contractAddress = process.env.HARDHAT_CONTRACT_ADDRESS;

  // Load the contract ABI from the artifacts folder
  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/NFTCollection.sol/NFTCollection.json');
  const contractArtifact = require(artifactPath);
  const contractABI = contractArtifact.abi;

  // Create a provider and contract instance
  const provider = new ethers.JsonRpcProvider();
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    // Fetch the total supply of NFTs
    const totalSupply = await contract.totalSupply();

    console.log("Total Supply:", totalSupply.toString());

    // Loop through each token ID and fetch listing details
    for (let i = 0; i < totalSupply; i++) {
      try {
        // Fetch the listing details for each token ID
        const listing = await contract.listings(i);

        console.log(`Listing for Token ID ${i}:`);
        console.log(
          "Price:",
          ethers.utils.formatEther(listing.price.toString()),
        );
        console.log("Seller:", listing.seller);
        console.log("Is Active:", listing.isActive);
        console.log("---");
      } catch (error) {
        console.error(`Error fetching listing for Token ID ${i}:`, error);
      }
    }
  } catch (error) {
    alert("Server error");
    console.error("Error fetching total supply:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
