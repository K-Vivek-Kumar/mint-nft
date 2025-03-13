if (typeof CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
        constructor(type, params = {}) {
            super(type, params);
            this.detail = params.detail || null;
        }
    };
}

import { IoTSensor } from './iotsensor.js';
import fs from 'fs';
import Web3 from 'web3';

const GANACHE_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = "0x750a94db95102c04fb3cbd65c2e9daa12f592ad1";

const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));

const contractPath = 'D:/ethereum/nft-contract/build/NFTCollection.json';
const contractABI = JSON.parse(fs.readFileSync(contractPath, 'utf8')).abi;

const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);



function obtainData() {
    return new Promise((resolve, reject) => {
        const sensor = new IoTSensor("Temp-Humid Sensor", { lat: 67.1256, lon: 48.2364 });

        // Start the sensor and wait until it's finished
        sensor.start(1, 'iots.csv', 10);

        // Wait for the expected duration + a small buffer (to ensure file writing completes)
        setTimeout(() => {
            try {
                const data = fs.readFileSync('iots.csv', 'utf8');
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, 11000); // 10 seconds for data collection + 1 second buffer
    });
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
        const cid = await fs.addBytes(encoder.encode(await obtainData()), helia.blockstore)
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

        const ownerOfTheNFT = await contract.methods.retrieveOwnerOfCID(storedCID).call();
        console.log("Owner of the NFT:", ownerOfTheNFT);
    } catch (error) {
        console.error("Error Minting NFT:", error);
    }
}

mintNFT().catch(err => {
    console.error(err)
    process.exit(1)
}).then(() => { process.exit(0) });
