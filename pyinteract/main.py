from connect_ganache import (
    get_all_past_owners,
    get_all_tokens,
    mint_nft,
    retrieve_owner_of_token,
    transfer_nft,
)
from utils import datetime_to_timestamp
from setup_aliases import set_alias_names


def main():
    alias_names = set_alias_names()
    print(alias_names)

    curr_owner = "Eve"

    txn = mint_nft(curr_owner, "ipfs://cid", alias_names[curr_owner])

    if txn.status == 0:
        print("NFT Not Minted")
        return

    print("NFT Minted Successfully")

    tokens = get_all_tokens(alias_names[curr_owner])
    for token in tokens:
        print(token, end="\n")
    print("")

    owner = retrieve_owner_of_token(tokens[-1][1])
    print("Current owner: ", owner)

    new_owner = "Charlie"

    txn = transfer_nft(
        curr_owner,
        new_owner,
        0,
        alias_names[curr_owner],
        0,
        datetime_to_timestamp("2025-04-15 12:00:00"),
        datetime_to_timestamp("2025-04-15 12:00:00"),
    )

    if txn and txn.status and txn.status == 0:
        print("Transfer was unsuccessful")
        return

    print("Transferring was successful")

    owner = retrieve_owner_of_token(tokens[-1][1])
    print("New owner: ", owner)

    past_owners = get_all_past_owners(0, alias_names[new_owner])
    for past_owner in past_owners:
        print(past_owner[0], ": [", past_owner[1], "]")


if __name__ == "__main__":
    main()
