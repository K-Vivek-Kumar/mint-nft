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

    mapping(uint => string) private tokenCIDs;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mintNFTs(uint _count, string[] memory _cids) public payable {
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

    function retrieveOwnerOfCID(
        string memory _cid
    ) public view returns (address) {
        for (uint i = 0; i < totalSupply(); i++) {
            if (
                keccak256(abi.encodePacked(tokenCIDs[i])) ==
                keccak256(abi.encodePacked(_cid))
            ) {
                return ownerOf(i);
            }
        }
        return address(0);
    }

    function transferNFT(
        address from,
        address to,
        uint _tokenId
    ) public payable returns (bool) {
        require(
            _isApprovedOrOwner(from, _tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        safeTransferFrom(from, to, _tokenId);
        return true;
    }
}
