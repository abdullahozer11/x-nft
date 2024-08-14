const {expect} = require("chai");
const {ethers} = require("hardhat");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("NFT Collection contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const XNFT = await ethers.deployContract("NFTCollection",
      [
        "example_base_uri",
        "X-NFT",
        "XNFT"
      ], owner)

    await XNFT.waitForDeployment();
    return {XNFT, owner, addr1, addr2};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const {XNFT, owner} = await loadFixture(deployTokenFixture);
      expect(await XNFT.owner()).to.equal(owner.address);
    });

    it("Should set the correct base URI", async function () {
      const {XNFT} = await loadFixture(deployTokenFixture);
      expect(await XNFT.baseTokenURI()).to.equal(
        "example_base_uri"
      );
    });
  });

  describe("Minting", function () {
    it("Should mint NFTs correctly", async function () {
      const {XNFT, addr1} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(2, {
        value: ethers.parseEther("0.002"),
      });

      expect(await XNFT.balanceOf(addr1.address)).to.equal(2);
    });

    it("Should fail if not enough ether is sent", async function () {
      const {XNFT, addr1} = await loadFixture(deployTokenFixture);

      await expect(
        XNFT.connect(addr1).mintNFTs(1, {
          value: ethers.parseEther("0.0001"),
        })
      ).to.be.revertedWith("Not enough ether to purchase NFTs.");
    });

    it("Should fail if minting more than MAX_SUPPLY", async function () {
      const {XNFT, addr1} = await loadFixture(deployTokenFixture);

      await expect(
        XNFT.connect(addr1).mintNFTs(11, {
          value: ethers.parseEther("0.011"),
        })
      ).to.be.revertedWith("This collection is sold out!");
    });
  });

  describe("Listing and Buying NFTs", function () {
    it("Should list and buy an NFT correctly", async function () {
      const {XNFT, owner, addr1, addr2} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(1, {
        value: ethers.parseEther("0.001"),
      });
      await XNFT.connect(addr1).listNFT(0, ethers.parseEther("0.002"));

      await XNFT.connect(addr2).buyNFT(0, {
        value: ethers.parseEther("0.002"),
      });

      expect(await XNFT.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should fail to list an NFT if not the owner", async function () {
      const {XNFT, addr1, addr2} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(1, {
        value: ethers.parseEther("0.001"),
      });

      await expect(
        XNFT.connect(addr2).listNFT(0, ethers.parseEther("0.002"))
      ).to.be.revertedWith("You are not the owner of this NFT");
    });

    it("Should fail to buy an unlisted NFT", async function () {
      const {XNFT, addr1, addr2} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(1, {
        value: ethers.parseEther("0.001"),
      });

      await expect(
        XNFT.connect(addr2).buyNFT(0, {
          value: ethers.parseEther("0.002"),
        })
      ).to.be.revertedWith("NFT is not for sale");
    });
  });

  describe("Withdrawals", function () {
    it("Should withdraw ether correctly", async function () {
      const {XNFT, owner, addr1} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(1, {
        value: ethers.parseEther("0.001"),
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);

      await XNFT.connect(owner).withdraw();

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      const {XNFT, addr1} = await loadFixture(deployTokenFixture);

      await XNFT.connect(addr1).mintNFTs(1, {
        value: ethers.parseEther("0.001"),
      });

      await expect(
        XNFT.connect(addr1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
