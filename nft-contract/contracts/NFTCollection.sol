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
    uint public constant MAX_SUPPLY = 100;
    uint public constant PRICE = 0.00001 ether;
    uint public constant MAX_PER_MINT = 100;

    string public baseTokenURI;

    // Mapping from token ID to its IPFS CID
    mapping(uint => string) private tokenCIDs;

    constructor(
        string memory baseURI,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        setBaseURI(baseURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function mintNFTs(uint _count, string[] memory _cids) public payable {
        uint totalMinted = _tokenIds.current();

        require(
            totalMinted.add(_count) <= MAX_SUPPLY,
            "This collection is sold out!"
        );
        require(
            _count > 0 && _count <= MAX_PER_MINT,
            "You have received the maximum amount of NFTs allowed."
        );
        require(
            msg.value >= PRICE.mul(_count),
            "Not enough ether to purchase NFTs."
        );
        require(
            _count == _cids.length,
            "CID array length must match mint count"
        );

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT(_cids[i]);
        }
    }

    function _mintSingleNFT(string memory _cid) private {
        uint newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        tokenCIDs[newTokenID] = _cid;
        _tokenIds.increment();
    }

    // Get CID (IPFS hash) of a specific NFT
    function getTokenCID(uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");
        return tokenCIDs[_tokenId];
    }

    function tokensOfOwner(
        address _owner
    ) external view returns (uint[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);

        for (uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function reserveNFTs(uint _count, string[] memory _cids) public onlyOwner {
        uint totalMinted = _tokenIds.current();

        require(
            totalMinted.add(_count) < MAX_SUPPLY,
            "Not enough NFTs left to reserve"
        );
        require(
            _count == _cids.length,
            "CID array length must match reserve count"
        );

        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT(_cids[i]);
        }
    }
}
