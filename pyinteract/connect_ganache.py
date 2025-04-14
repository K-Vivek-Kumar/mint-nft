from web3 import Web3
import json

GANACHE_URL = "http://127.0.0.1:8545"
CONTRACT_ADDRESS = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
CONTRACT_ABI = "D:/ethereum/nft-contract/build/NFTRecord.json"

web3 = Web3(Web3.HTTPProvider(GANACHE_URL))


def connect_nft_contract():
    """Load the NFT contract once to avoid unnecessary reloading"""
    with open(CONTRACT_ABI, "r") as f:
        contract_json = json.load(f)
        contract_abi = contract_json["abi"]
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
    return contract


def account_hashes():
    """Return the list of accounts from Ganache"""
    return web3.eth.accounts


def update_username(username, account_hash):
    """Update the username of a user"""
    contract = connect_nft_contract()

    try:
        txn = contract.functions.updateUsername(username).build_transaction(
            {
                "from": account_hash,
            }
        )
        txn_hash = web3.eth.send_transaction(txn)
        receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
        return receipt
    except Exception as e:
        print(f"Exception in update_username: {e}")
        return None


def mint_nft(username, cid, account_hash):
    """Mint a new NFT"""
    contract = connect_nft_contract()

    try:
        txn = contract.functions.mintNFT(username, cid).build_transaction(
            {
                "from": account_hash,
                "value": web3.to_wei(0.00001, "ether"),
                "gas": 300000,
                "gasPrice": web3.to_wei("20", "gwei"),
                "nonce": web3.eth.get_transaction_count(account_hash),
            }
        )

        txn_hash = web3.eth.send_transaction(txn)
        receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
        return receipt
    except Exception as e:
        print(f"Exception in mint_nft: {e}")
        return None


def retrieve_owner_of_token(token_id):
    """Retrieve the current owner of a token"""
    contract = connect_nft_contract()

    try:
        owner = contract.functions.getCurrentOwner(token_id).call()
        return owner
    except Exception as e:
        print(f"Exception in retrieve_owner_of_token: {e}")
        return None


def get_all_tokens(account_hash):
    """Get all tokens for a given account"""
    contract = connect_nft_contract()

    try:
        tokens = contract.functions.getAllTokens().call({"from": account_hash})
        return tokens
    except Exception as e:
        print(f"Exception in get_all_tokens: {e}")
        return None


def transfer_nft(
    from_username,
    to_username,
    token_id,
    account_hash,
    permission_type,
    start_date_time,
    end_date_time,
):
    """Transfer NFT from one user to another"""
    contract = connect_nft_contract()

    try:
        txn = contract.functions.transferNFT(
            from_username,
            to_username,
            token_id,
            permission_type,
            start_date_time,
            end_date_time,
        ).build_transaction({"from": account_hash})
        txn_hash = web3.eth.send_transaction(txn)
        receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
        return receipt
    except Exception as e:
        print(f"Exception in transfer_nft: {e}")
        return None


def tokens_of_owner(username):
    """Get all tokens owned by a user"""
    contract = connect_nft_contract()

    try:
        pass
    except Exception as e:
        print(f"Exception in tokens_of_owner: {e}")
        return None


def get_token_cid(token_id):
    """Get the CID for a token"""
    contract = connect_nft_contract()

    try:
        cid = contract.functions.getTokenCID(token_id).call()
        return cid
    except Exception as e:
        print(f"Exception in get_token_cid: {e}")
        return None


def get_all_past_owners(token_id, account_hash):
    contract = connect_nft_contract()

    try:
        owners, permission_type = contract.functions.getAllPastOwners(
            token_id
        ).call({"from": account_hash})

        past_owners = [(owners[i], permission_type[i]) for i in range(len(owners))]

        return past_owners
    except Exception as e:
        print("Unable to get past owners: ", e)
        return None
