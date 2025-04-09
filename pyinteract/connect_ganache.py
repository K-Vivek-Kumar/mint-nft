from web3 import Web3
import json

from usernames import usernames

GANACHE_URL = "http://127.0.0.1:8545"
CONTRACT_ADDRESS = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
CONTRACT_ABI = "D:/ethereum/nft-contract/build/NFTCollection.json"

def connect_ganache():
    return Web3(Web3.HTTPProvider(GANACHE_URL))

def connect_nft_contract():
    web3 = connect_ganache()
    with open(CONTRACT_ABI, 'r') as f:
        contract_json = json.load(f)
        contract_abi = contract_json['abi']
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
    return contract

def get_account_hash(obj, value):
    for k, v in obj.items():
        if v == value:
            return k
    return None

def get_accounts():
    web3 = connect_ganache()
    accounts = web3.eth.accounts
    users = {accounts[i]: usernames[i] for i in range(len(accounts))}
    return users

def mint_nft(username, cid):
    web3 = connect_ganache()
    contract = connect_nft_contract()
    users = get_accounts()
    account = get_account_hash(users, username)
    
    txn = contract.functions.mintNFTs(1, [cid]).build_transaction({
        'from': account,
        'value': web3.to_wei(0.00001, 'ether'),
        'gas': 300000,
        'nonce': web3.eth.get_transaction_count(account)
    })

    txn_hash = web3.eth.send_transaction(txn)
    receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    return receipt

def retrieve_owner_of_cid(cid):
    contract = connect_nft_contract()
    users = get_accounts()
    owner = contract.functions.retrieveOwnerOfCID(cid).call()
    return users.get(owner, "Unknown")

def transfer_nft(from_username, to_username, token_id):
    web3 = connect_ganache()
    contract = connect_nft_contract()
    users = get_accounts()
    sender = get_account_hash(users, from_username)
    receiver = get_account_hash(users, to_username)

    txn = contract.functions.transferNFT(sender, receiver, token_id).build_transaction({
        'from': sender,
        'gas': 300000,
        'nonce': web3.eth.get_transaction_count(sender)
    })

    txn_hash = web3.eth.send_transaction(txn)
    receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    return receipt

def tokens_of_owner(username):
    web3 = connect_ganache()
    contract = connect_nft_contract()
    users = get_accounts()
    owner = get_account_hash(users, username)

    tokens_owned = contract.functions.tokensOfOwner(owner).call()
    return tokens_owned

def get_token_cid(token_id):
    web3 = connect_ganache()
    contract = connect_nft_contract()

    cid = contract.functions.getTokenCID(token_id).call()
    return cid