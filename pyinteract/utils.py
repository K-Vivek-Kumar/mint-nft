from datetime import datetime


def datetime_to_timestamp(date_string: str) -> int:
    dt = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
    timestamp = int(dt.timestamp())

    return timestamp
