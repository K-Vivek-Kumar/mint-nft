import random

from connect_ganache import get_all_past_owners, retrieve_owner_of_token, transfer_nft
from utils import datetime_to_timestamp
from setup_aliases import set_alias_names


def next_random_owner(users, curr_owner):
    available_owners = [user for user in users if user != curr_owner]
    return random.choice(available_owners)


def main():
    users = set_alias_names()
    target_token = 0
    curr_owner = retrieve_owner_of_token(target_token)

    for i in range(10):
        new_owner = next_random_owner(users, curr_owner)

        txn = transfer_nft(
            curr_owner,
            new_owner,
            0,
            users[curr_owner],
            0,
            datetime_to_timestamp("2025-04-15 12:00:00"),
            datetime_to_timestamp("2025-04-15 12:00:00"),
        )

        if txn and txn.status and txn.status == 0:
            print("Transfer was unsuccessful")
            return

        print("Transferring was successful")

        curr_owner = new_owner

    past_owners = get_all_past_owners(0, users[new_owner])
    for past_owner in past_owners:
        print(past_owner[0], ": [", past_owner[1], "]")


if __name__ == "__main__":
    main()
