// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTRecord is ERC721 {
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
    mapping(string => Owner) public ownerDetails;
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

    function mintNFT(
        string memory firstOwnerUserName,
        string memory ipfsCID
    ) public payable {
        require(
            ownerDetails[firstOwnerUserName].ownerAddress == msg.sender,
            "Account is not yours!!"
        );

        uint256 newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);

        nftDetails[newTokenID] = NFTAsset({
            cid: ipfsCID,
            id: newTokenID,
            currentOwner: msg.sender,
            mintedTimestamp: block.timestamp
        });

        _tokenIds.increment();
    }

    function transferNFT(
        string memory fromUsername,
        string memory toUsername,
        uint256 tokenId,
        Permission transferType,
        uint256 accessStart,
        uint256 accessEnd
    ) public {
        require(_exists(tokenId), "Token does not exist");

        address from = ownerDetails[fromUsername].ownerAddress;
        require(
            msg.sender == from,
            "You can't initiate transfer from another user"
        );
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

    function getAllTokens() public view returns (NFTAsset[] memory) {
        uint256 totalTokens = _tokenIds.current();
        NFTAsset[] memory tokens = new NFTAsset[](totalTokens);

        for (uint256 i = 0; i < totalTokens; i++) {
            tokens[i] = nftDetails[i];
        }

        return tokens;
    }

    function getCurrentOwner(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        address currentOwnerAddress = nftDetails[tokenId].currentOwner;
        return reverseAlias[currentOwnerAddress];
    }

    function updateUsername(string memory newUsername) public {
        string memory oldUsername = reverseAlias[msg.sender];

        if (keccak256(bytes(newUsername)) == keccak256(bytes(oldUsername))) {
            return;
        }

        require(
            ownerDetails[newUsername].ownerAddress == address(0),
            "Username already taken"
        );

        if (bytes(oldUsername).length > 0) {
            delete ownerDetails[oldUsername];
            delete ownerAlias[oldUsername];
        }

        ownerDetails[newUsername] = Owner(msg.sender, newUsername);
        ownerAlias[newUsername] = msg.sender;
        reverseAlias[msg.sender] = newUsername;
    }

    function getTokenCID(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return nftDetails[tokenId].cid;
    }
}
