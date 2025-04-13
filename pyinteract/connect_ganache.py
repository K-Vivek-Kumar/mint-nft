from web3 import Web3
import json

GANACHE_URL = "http://127.0.0.1:8545"
CONTRACT_ADDRESS = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
CONTRACT_ABI = "D:/ethereum/nft-contract/build/NFTRecord.json"


def connect_ganache():
    return Web3(Web3.HTTPProvider(GANACHE_URL))


def account_hashes():
    web3 = connect_ganache()
    return web3.eth.accounts


def connect_nft_contract():
    web3 = connect_ganache()
    with open(CONTRACT_ABI, "r") as f:
        contract_json = json.load(f)
        contract_abi = contract_json["abi"]
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
    return contract


def update_username(username, account_hash):
    web3 = connect_ganache()
    contract = connect_nft_contract()

    try:
        contract.functions.updateUsername(username).build_transaction(
            {
                "from": account_hash,
            }
        )
    except Exception as e:
        print("Exception: ", e)


def mint_nft(username, cid, account_hash):
    # Connect to the blockchain and the NFT contract
    web3 = connect_ganache()
    contract = connect_nft_contract()

    # Prepare the transaction
    txn = contract.functions.mintNFT(username, cid).build_transaction(
        {
            "from": account_hash,
            "value": web3.to_wei(0.00001, "ether"),  # Corrected toWei()
            "gas": 300000,  # You might want to calculate the gas dynamically
            "gasPrice": web3.to_wei("20", "gwei"),  # Set gas price (adjust as needed)
            "nonce": web3.eth.get_transaction_count(
                account_hash
            ),  # Make sure the nonce is set
        }
    )

    # Send the transaction
    txn_hash = web3.eth.send_transaction(txn)

    # Wait for the receipt
    receipt = web3.eth.wait_for_transaction_receipt(txn_hash)

    return receipt


def retrieve_owner_of_token(token_id):
    contract = connect_nft_contract()
    owner = contract.functions.getCurrentOwner(token_id).call()
    return owner


# TODO: Modify the code from here


def transfer_nft(from_username, to_username, token_id):
    web3 = connect_ganache()
    contract = connect_nft_contract()


def tokens_of_owner(username):
    web3 = connect_ganache()
    contract = connect_nft_contract()


def get_token_cid(token_id):
    web3 = connect_ganache()
    contract = connect_nft_contract()

    cid = contract.functions.getTokenCID(token_id).call()
    return cid
