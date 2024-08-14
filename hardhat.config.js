require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  paths: {
    sources: "./contracts",
    tests: "./__tests__",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [process.env.HARDHAT_PRIVATE_KEY]
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_API_KEY,
      accounts: [`${process.env.SEPOLIA_PRIVATE_KEY}`]
    }
  },
  mocha: {
    timeout: 40000
  }
};
