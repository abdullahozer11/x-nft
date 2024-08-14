// scripts/callContract.js

const { ethers } = require("hardhat");
require('dotenv').config();
const path = require('path');

async function main() {
  const contractAddress = process.env.SEPOLIA_CONTRACT_ADDRESS;

  // Load the private key from the environment variable
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  // Create a wallet instance using the private key
  const wallet = new ethers.Wallet(privateKey);

  // Set up the Infura provider for Sepolia network
  const provider = new ethers.InfuraProvider('sepolia', process.env.INFURA_API_KEY);

  // Connect the wallet to the provider to create a signer
  const signer = wallet.connect(provider);

  // Load the contract ABI from the artifacts folder
  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/NFTCollection.sol/NFTCollection.json');
  const contractArtifact = require(artifactPath);
  const contractABI = contractArtifact.abi;

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
