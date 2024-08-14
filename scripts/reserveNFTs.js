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

  // Get a signer instance
  const [signer] = await ethers.getSigners();

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    // Call the function on the contract
    const result = await contract.reserveNFTs(10);
    console.log("Function result:", result);
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
