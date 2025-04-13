# Alias setup, update usernames

from connect_ganache import account_hashes, update_username

def set_alias_names():
    accounts = account_hashes()

    alias_names = {
        "Alice": accounts[0],
        "Bob": accounts[1],
        "Charlie": accounts[2]
    }

    for k, v in alias_names.items():
        update_username(k, v)
    
    return alias_names
