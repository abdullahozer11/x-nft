// env.test.js
const { expect } = require("chai");
require('dotenv').config();

describe('Environment Variables', () => {

  it('should have HARDHAT_WALLET_ADDRESS defined', () => {
    expect(process.env.HARDHAT_WALLET_ADDRESS).to.exist;
  });

  it('should have HARDHAT_PRIVATE_KEY defined', () => {
    expect(process.env.HARDHAT_PRIVATE_KEY).to.exist;
  });

  it('should have HARDHAT_CONTRACT_ADDRESS defined', () => {
    expect(process.env.HARDHAT_CONTRACT_ADDRESS).to.exist;
  });

  it('should have SEPOLIA_CONTRACT_ADDRESS defined', () => {
    expect(process.env.SEPOLIA_CONTRACT_ADDRESS).to.exist;
  });

  it('should have NFT_NAME defined', () => {
    expect(process.env.NFT_NAME).to.exist;
  });

  it('should have NFT_BASE_URI defined', () => {
    expect(process.env.NFT_BASE_URI).to.exist;
  });

  it('should have NFT_IDENTIFIER defined', () => {
    expect(process.env.NFT_IDENTIFIER).to.exist;
  });

});
