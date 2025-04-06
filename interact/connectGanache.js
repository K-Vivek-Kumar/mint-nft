import Web3 from 'web3';
import fs from 'fs';
import { usernames } from './usernames.js';

const GANACHE_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C";
const contractPath = 'D:/ethereum/nft-contract/build/NFTCollection.json';

const connectGanache = () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
    return web3;
}

const connectNFTCollection = () => {
    const web3 = connectGanache();
    const contractABI = JSON.parse(fs.readFileSync(contractPath, 'utf8')).abi;
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
    return contract;
}

const getAccountHash = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
};

export const getAccounts = async () => {
    const web3 = connectGanache();
    const accounts = await web3.eth.getAccounts();
    const users = {};
    for (let i = 0; i < accounts.length; i++) {
        users[accounts[i]] = usernames[i];
    }
    return users;
}

export const mintNFT = async (username, cid) => {
    const contract = connectNFTCollection();
    const web3 = connectGanache();
    const users = await getAccounts();
    const response = await contract.methods.mintNFTs(1, [cid]).send({
        from: getAccountHash(users, username),
        value: web3.utils.toWei('0.00001', 'ether'),
        gas: 300000
    });
    return response;
}

export const retrieveOwnerOfCID = async (cid) => {
    const contract = connectNFTCollection();
    const users = await getAccounts();
    const ownerOfNFT = await contract.methods.retrieveOwnerOfCID(cid).call();
    return users[ownerOfNFT];
}

export const transferNFT = async (fromusername, tousername, tokenId) => {
    const contract = connectNFTCollection();
    const users = await getAccounts();
    const response = await contract.methods.transferNFT(getAccountHash(users, fromusername), getAccountHash(users, tousername), tokenId).send({
        from: getAccountHash(users, fromusername),
        gas: 300000
    });
    return response;
}