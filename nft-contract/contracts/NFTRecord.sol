// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTRecord is ERC721 {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    struct Owner {
        address ownerAddress;
        string username;
    }

    struct NFTAsset {
        string cid;
        uint256 id;
        address currentOwner;
        uint256 mintedTimestamp;
    }

    enum Permission {
        SELL,
        LICENSE
    }

    struct OwnershipRecords {
        Owner previousOwner;
        Owner currentOwner;
        string assetTransferred;
        Permission transferType;
        uint256 assetAccessStartTimestamp;
        uint256 assetAccessEndTimestamp;
    }

    // Mappings
    mapping(string => address) private ownerAlias;
    mapping(address => string) private reverseAlias;
    mapping(string => Owner) private ownerDetails;
    mapping(uint256 => NFTAsset) private nftDetails;
    mapping(uint256 => OwnershipRecords[]) public transferHistory;

    event OwnershipTransferred(
        string indexed asset,
        address indexed previousOwner,
        address indexed currentOwner,
        uint256 assetAccessStartTimestamp,
        uint256 assetAccessEndTimestamp,
        Permission transferType
    );

    constructor() ERC721("NFTRecord", "KVK") {}

    function authenticateName(
        string memory username
    ) private view returns (bool) {
        return ownerDetails[username].ownerAddress == msg.sender;
    }

    function registerUsername(string memory username) public {
        require(
            ownerDetails[username].ownerAddress == address(0),
            "Username already taken"
        );

        ownerDetails[username] = Owner(msg.sender, username);
        ownerAlias[username] = msg.sender;
        reverseAlias[msg.sender] = username;
    }

    function mintNFT(
        string memory firstOwnerUserName,
        string memory ipfsCID
    ) public returns (uint256) {
        require(authenticateName(firstOwnerUserName), "Account is not yours!!");

        uint256 newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);

        nftDetails[newTokenID] = NFTAsset({
            cid: ipfsCID,
            id: newTokenID,
            currentOwner: msg.sender,
            mintedTimestamp: block.timestamp
        });

        _tokenIds.increment();
        return newTokenID;
    }

    function transferNFT(
        string memory fromUsername,
        string memory toUsername,
        uint256 tokenId,
        Permission transferType,
        uint256 accessStart,
        uint256 accessEnd
    ) public {
        address from = ownerDetails[fromUsername].ownerAddress;
        address to = ownerDetails[toUsername].ownerAddress;

        require(_isApprovedOrOwner(from, tokenId), "Not approved or owner");
        require(to != address(0), "Invalid recipient");

        safeTransferFrom(from, to, tokenId);
        nftDetails[tokenId].currentOwner = to;

        transferHistory[tokenId].push(
            OwnershipRecords({
                previousOwner: ownerDetails[fromUsername],
                currentOwner: ownerDetails[toUsername],
                assetTransferred: nftDetails[tokenId].cid,
                transferType: transferType,
                assetAccessStartTimestamp: accessStart,
                assetAccessEndTimestamp: accessEnd
            })
        );

        emit OwnershipTransferred(
            nftDetails[tokenId].cid,
            from,
            to,
            accessStart,
            accessEnd,
            transferType
        );
    }

    function getCurrentOwner(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        address currentOwnerAddress = nftDetails[tokenId].currentOwner;
        return reverseAlias[currentOwnerAddress];
    }

    function updateUsername(string memory newUsername) public {
        require(
            ownerDetails[newUsername].ownerAddress == address(0),
            "Username already taken"
        );

        string memory oldUsername = reverseAlias[msg.sender];
        require(bytes(oldUsername).length != 0, "No existing username found");

        delete ownerDetails[oldUsername];
        delete ownerAlias[oldUsername];

        ownerDetails[newUsername] = Owner(msg.sender, newUsername);
        ownerAlias[newUsername] = msg.sender;
        reverseAlias[msg.sender] = newUsername;
    }

    function getTokenCID(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return nftDetails[tokenId].cid;
    }
}
