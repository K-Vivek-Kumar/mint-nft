if (typeof CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
        constructor(type, params = {}) {
            super(type, params);
            this.detail = params.detail || null;
        }
    };
}

import fs from 'fs';
import Web3 from 'web3';

const GANACHE_URL = "http://127.0.0.1:7545";
const CONTRACT_ADDRESS = "0x298b279ADD61B106906447F5d971798123eC8EdC";

const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));

const contractPath = 'D:/ethereum/nft-contract/build/NFTCollection.json';
const contractABI = JSON.parse(fs.readFileSync(contractPath, 'utf8')).abi;

const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

function obtainData() {
    console.log("Obtaining Data....");
    let data = "";
    for (let i = 0; i < 1; i++) {
        data += "Series Data " + (i + 1) + ": " + new Date().toISOString() + " Random " + Math.random() + "\n";
    }
    console.log(data);
    return data;
}


async function mintNFT() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Available Accounts:", accounts);

        let ipfsCID = "";


        const { createHelia } = await import('helia')
        const { unixfs } = await import('@helia/unixfs')

        const helia = await createHelia()

        console.log(helia.libp2p.peerId)

        const fs = unixfs(helia)
        const encoder = new TextEncoder()
        const cid = await fs.addBytes(encoder.encode(obtainData()), helia.blockstore)
        ipfsCID = `ipfs://${cid.toString()}`;

        console.log("Generated CID:", ipfsCID);


        const response = await contract.methods.mintNFTs(1, [ipfsCID]).send({
            from: accounts[1],
            value: web3.utils.toWei('0.00001', 'ether'),
            gas: 300000
        });

        // console.log("NFT Minted Successfully:", response);
        const tokenId = response.events.Transfer.returnValues.tokenId;
        console.log("Minted Token ID:", tokenId);

        const storedCID = await contract.methods.getTokenCID(tokenId).call();
        console.log("Stored CID in the contract:", storedCID);




        const decoder = new TextDecoder()
        let text = ""

        for await (const chunk of fs.cat(storedCID.toString().slice(7))) {
            text += decoder.decode(chunk, {
                stream: true
            })
        }

        console.log('Rolled back file contents:', text)




        for (let account of accounts) {
            const tokensOwned = await contract.methods.tokensOfOwner(account).call();
            console.log("Tokens for account [", account, "]: ");
            for (let tokens of tokensOwned) {
                const tokenCID = await contract.methods.getTokenCID(tokens).call();
                console.log("Token CID [", tokens, "]: ", tokenCID);
            }
        }
    } catch (error) {
        console.error("Error Minting NFT:", error);
    }
}

mintNFT().catch(err => {
    console.error(err)
    process.exit(1)
}).then(() => { process.exit(0) });
