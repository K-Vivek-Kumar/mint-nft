# Minting an NFT Stored on IPFS onto Ganache Using Truffle

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js (14.x - 18.x)**: Truffle requires a compatible Node.js version.
- **NVM (Node Version Manager)**: Recommended for managing Node versions. Install and set up Node.js 18 using:
  ```bash
  nvm install 18
  nvm use 18
  ```
  The Long-Term Support (LTS) version of Node 18 is `18.20.7`.
- **Git**: To clone the repository.
- **Truffle (v5.11.5)**: Required for contract development and deployment.
- **Ganache (v7.9.1)**: Local blockchain for development.

## Cloning the Repository

To get started, clone the repository from GitHub:

```bash
git clone https://github.com/K-Vivek-Kumar/mint-nft.git
```

## Installing Dependencies

### 1. Install Truffle Globally

Ensure Truffle is installed globally:

```bash
npm install -g truffle@5.11.5
```

### 2. Install Project Dependencies

Navigate to the respective directories and install dependencies:

```bash
cd nft-contract
npm install
cd ..
cd interact
npm install
```

### 3. Verify Installation

Check installed versions with:

```bash
truffle version
```

Expected output:

```
Truffle v5.11.5 (core: 5.11.5)
Ganache v7.9.1
Solidity v0.5.16 (solc-js)
Node v18.20.7
Web3.js v1.10.0
```

## Running the Project (v1-interact-ipfs-helia-javascript)

You will need **three terminal sessions**:

1. Start the Ganache blockchain.
2. Compile and deploy the smart contract.
3. Run the interaction script.

### **1. Start Ganache** (First Terminal Session)

Start the local blockchain from the project root:

```bash
ganache
```

By default, Ganache runs on **localhost:8545**.

> Note: Ganache when ran using the above command creates an in-memory blockchain which is cleared once you close the ganache server. The contracts, blocks and transactions done in such cases are removed and can't be seen in a new ganache instance.

For a reusable instance of the Ganache you need to run the following command:

```bash
ganache --db ./ganache-data --deterministic
```

Here `./ganache-data` is the directory relative to the parent directory where all the data about the ganache blocks, contracts and users are stored.

> **Note:** If port 8545 is occupied, update `truffle-config.js` in `nft-contract/`, `connectGanache.js` and `index.js` in `interact/` to match the new port.

### **2. Deploy Smart Contract** (Second Terminal Session)

#### Navigate to `nft-contract` Directory

```bash
cd nft-contract
```

#### Compile the Smart Contract

```bash
truffle compile
```

Check that a `build/` directory appears with ABI JSON files.

#### Deploy the Contract to Ganache

```bash
truffle migrate
```

This deploys the contract, consuming some test ETH. Upon success, you will see the contract address.

> **Important:** Copy the deployed **contract address** and update the `CONTRACT_ADDRESS` variable in `interact/index.js` and also in `interact/connectGanache.js`.

### **3. Run the Interaction Script** (Third Terminal Session)

#### Execute the Script

Navigate to the `interact/` directory and run:

```bash
node index.js
```

> Note: `index.js` is an implementation of singular helia node IPFS which doesn't store the files in the network. The more better implementation in form of persistent helia node is written in the `main.js` script. This `main.js` script is well written using various functions and also using alias names for the users in the ganache blockchain.

You can run the `main.js` file using the following command in the `interact/` directory.

```bash
node main.js
```

These scripts:

- Uploads the NFT metadata to IPFS.
- Calls the smart contract to mint the NFT.
- Verifies the stored NFT data.

## Running the Project (v2-pyinteract-python)

Similar to previous project we compile and migrate the smart contract onto the Ethereum but now this time we interact it using python web3 package.

> TODO!!

## Troubleshooting

If you encounter issues:

- **Check installed versions**:
  ```bash
  truffle version
  node -v
  npm -v
  ```
- **Ensure Ganache is running** before migrating contracts.
- **Confirm correct contract address** is set in `index.js` and `connectGanache.js`.
- **Use `truffle migrate --reset`** if redeploying contracts.

This completes the setup and execution process. If errors persist, verify your configurations and dependencies.

## Implementing Alias Names Logic

Implemented in the `interact/connectGanache.js` as the `getAccounts` function which returns the user hashes and corresponding alias names taken from the `interact/usernames.js` list of names. This is returned in form of map between hash and corresponding name.

## Implementing Persistent Helia Node

We can implement this persistent helia node using the `datastore-fs` and `blockstore-fs` libraries. `datastore-fs` library helps store the libp2p peer details of the helia node and `blockstore-fs` library helps store the files uploaded by the helia node.

One can implement this in the following way using the `createHelia` API:

```javascript
import { createHelia } from "helia";
import { FsDatastore } from "datastore-fs";
import { FsBlockstore } from "blockstore-fs";

const heliaNode = await createHelia({
  datastore: new FsDatastore("/ipfs/random-node/datastore"),
  blockstore: new FsDatastore("/ipfs/random-node/blockstore"),
  libp2p: {
    addresses: {
      listen: [
        "/ip4/127.0.0.1/tcp/4002",
        "/ip4/127.0.0.1/udp/9002/webrtc-direct",
      ],
    },
  },
});
```

> Note: This solution is inspired by the following solution: [https://github.com/smakintel/ipfs-helia](https://github.com/smakintel/ipfs-helia), which was been discussed on the following thread: [IPFS Tech: Persistent Helia Node](https://discuss.ipfs.tech/t/i-used-helia-to-run-local-ipfs-node-using-electron-how-to-persist-nodeid/17766/9).

A flexible implementation of this persistent Helia Node idea is done in the following file, `/interact/createNode.js`.
