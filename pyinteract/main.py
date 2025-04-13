from connect_ganache import mint_nft, retrieve_owner_of_token
from setup_aliases import set_alias_names

def main():
    alias_names = set_alias_names()
    print(alias_names)
    txn = mint_nft("Alice", "ipfs://cid", alias_names["Alice"])

    print("Transaction details: ", txn)

    # owner = retrieve_owner_of_token(token_id)
    # print("Stored as an owner of: ", owner)

if __name__ == "__main__":
    main()