// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCollection is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    // The max number of NFTs in the collection
    uint public constant MAX_SUPPLY = 10;
    // The mint price for the collection
    uint public constant PRICE = 0.001 ether;
    // The max number of mints per wallet
    uint public constant MAX_PER_MINT = 5;

    string public baseTokenURI;

    // Structure to represent a sale listing
    struct Listing {
        uint price;
        address seller;
        bool isActive;
    }

    // Mapping from token ID to sale listing
    mapping(uint => Listing) public listings;

    event PaymentTransferred(address indexed seller, uint amount);

    constructor(string memory baseURI, string memory name, string memory symbol) ERC721(name, symbol) {
        setBaseURI(baseURI);
    }


    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count) public payable {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(_count) <= MAX_SUPPLY, "This collection is sold out!");
        require(_count > 0 && _count <= MAX_PER_MINT, "You have received the maximum amount of NFTs allowed.");
        require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }
    }

    function _mintSingleNFT() private {
        uint newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    // Returns the ids of the NFTs owned by the wallet address
    function tokensOfOwner(address _owner) external view returns (uint[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);

        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    // Withdraw the ether in the contract
    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success,) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    // Reserve NFTs only for owner to mint for free
    function reserveNFTs(uint _count) public onlyOwner {
        uint totalMinted = _tokenIds.current();

        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left to reserve");

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }
    }

    // Function to list an NFT for sale
    function listNFT(uint _tokenId, uint _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this NFT");
        require(_price > 0, "Price must be greater than 0");

        listings[_tokenId] = Listing({
            price: _price,
            seller: msg.sender,
            isActive: true
        });
    }

    // Function to remove a listing
    function removeListing(uint _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this NFT");
        require(listings[_tokenId].isActive, "Listing is not active");

        listings[_tokenId].isActive = false;
    }

    // Function to buy a listed NFT
    function buyNFT(uint _tokenId) public payable {
        Listing memory listing = listings[_tokenId];
        require(listing.isActive, "NFT is not for sale");
        require(msg.value >= listing.price, "Not enough ether sent");
        require(ownerOf(_tokenId) != msg.sender, "Cannot buy your own NFT");

        // Transfer ownership
        _transfer(listing.seller, msg.sender, _tokenId);

        // Transfer payment to the seller
        (bool success,) = payable(listing.seller).call{value: listing.price}("");
        require(success, "Transfer to seller failed");

        // Deactivate the listing
        listings[_tokenId].isActive = false;

        emit PaymentTransferred(listing.seller, listing.price);
    }
}
