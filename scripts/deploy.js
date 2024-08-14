// deploy.js
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const Contract = await hre.ethers.getContractFactory("NFTCollection");
  const contract = await Contract.deploy(
    process.env.NFT_BASE_URI,
    process.env.NFT_NAME,
    process.env.NFT_IDENTIFIER
 );
  await contract.waitForDeployment();
  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
