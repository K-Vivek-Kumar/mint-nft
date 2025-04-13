from connect_ganache import get_all_tokens, mint_nft, retrieve_owner_of_token
from setup_aliases import set_alias_names


def main():
    alias_names = set_alias_names()
    txn = mint_nft("Alice", "ipfs://cid", alias_names["Alice"])

    if txn.status == 0:
        print("NFT Not Minted")
        return

    print("NFT Minted Successfully")

    tokens = get_all_tokens(alias_names["Alice"])
    for token in tokens:
        print(token[1], end=", ")

    # owner = retrieve_owner_of_token(token_id)
    # print("Stored as an owner of: ", owner)


if __name__ == "__main__":
    main()
