// scripts/getContractInfo.js

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
    // Get the owner of the contract
    const owner = await contract.owner();
    console.log("Owner:", owner);

    // Get the total supply of NFTs
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", totalSupply.toString());

    // You can add more calls to retrieve other information from the contract
    // For example, if there is a function to get the name of the collection:
    const name = await contract.name();
    console.log("Collection Name:", name);

    // If there is a function to get the symbol of the collection:
    const symbol = await contract.symbol();
    console.log("Collection Symbol:", symbol);

  } catch (error) {
    console.error("Error retrieving contract information:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
