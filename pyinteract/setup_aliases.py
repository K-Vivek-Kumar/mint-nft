# Alias setup, update usernames

from connect_ganache import account_hashes, update_username
from usernames import usernames


def set_alias_names():
    accounts = account_hashes()

    alias_names = {}

    for i in range(len(accounts)):
        alias_names[usernames[i]] = accounts[i]

    for k, v in alias_names.items():
        update_username(k, v)

    return alias_names
