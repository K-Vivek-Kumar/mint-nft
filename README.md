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

## Running the Project

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

> **Note:** If port 8545 is occupied, update `truffle-config.js` in `nft-contract/` and `index.js` in `interact/` to match the new port.

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

> **Important:** Copy the deployed **contract address** and update the `CONTRACT_ADDRESS` variable in `interact/index.js`.

### **3. Run the Interaction Script** (Third Terminal Session)

#### Execute the Script

Navigate to the `interact/` directory and run:

```bash
node index.js
```

This script:

- Uploads the NFT metadata to IPFS.
- Calls the smart contract to mint the NFT.
- Verifies the stored NFT data.

## Troubleshooting

If you encounter issues:

- **Check installed versions**:
  ```bash
  truffle version
  node -v
  npm -v
  ```
- **Ensure Ganache is running** before migrating contracts.
- **Confirm correct contract address** is set in `index.js`.
- **Use `truffle migrate --reset`** if redeploying contracts.

This completes the setup and execution process. If errors persist, verify your configurations and dependencies.
