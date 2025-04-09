from connect_ganache import transfer_nft, tokens_of_owner, retrieve_owner_of_cid, get_token_cid

GANACHE_URL = "http://127.0.0.1:8545"
CONTRACT_ADDRESS = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C"
CONTRACT_ABI = 'D:/ethereum/nft-contract/build/NFTCollection.json'

def main():
    tokens = tokens_of_owner("Charlie")
    
    if len(tokens) == 0:
        print("No NFT Token with this owner")
        return
    
    token_id = tokens[0]
    cid = get_token_cid(token_id)

    curr_owner = retrieve_owner_of_cid(cid)
    print("Current Owner: ", curr_owner)

    print("Lets transfer")
    res = transfer_nft("Charlie", "Bob", token_id)

    new_owner = retrieve_owner_of_cid(cid)
    print("New Owner: ", new_owner)
    print("Transfer was successful")

if __name__ == "__main__":
    main()