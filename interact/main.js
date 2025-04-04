if (typeof CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
        constructor(type, params = {}) {
            super(type, params);
            this.detail = params.detail || null;
        }
    };
}

import { startNode, getPeerId, stopNode, uploadFile } from "./createNode.js";
import { node1Addresses } from "./availableNodeAddresses.js";
import { obtainData } from "./iotsensor.js";
import { mintNFT, retrieveOwnerOfCID, getAccounts, transferNFT } from "./connectGanache.js";

const node1 = await startNode('node1', node1Addresses);
console.log("Node 1 started with Peer ID: ", await getPeerId(node1));

const cid = uploadFile(node1, await obtainData()).toString();
console.log("File uploaded to Node 1. CID:", cid);

const users = await getAccounts();
console.log("Users:", users);

const username = "Bob";

const response = await mintNFT(username, cid);
console.log("NFT minted successfully in the name of ", username);

const tokenId = response.events.Transfer.returnValues.tokenId;
console.log("Token saved as token Id: ", tokenId);

const ownerOfNFT = await retrieveOwnerOfCID(cid);
console.log("Owner of the NFT:", ownerOfNFT);

const newOwner = "Charlie";
console.log("Transferring NFT from ", username, " to ", newOwner);
const _ = await transferNFT(username, newOwner, tokenId);

const newOwnerOfNFT = await retrieveOwnerOfCID(cid);
console.log("New Owner of the NFT:", newOwnerOfNFT);

await stopNode(node1);
