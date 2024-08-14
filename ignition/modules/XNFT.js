const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();

module.exports = buildModule("XNFT", (m) => {
  const XNFT = m.contract("NFTCollection", [
    process.env.NFT_BASE_URI, process.env.NFT_NAME, process.env.NFT_IDENTIFIER
  ]);
  return {XNFT};
});
