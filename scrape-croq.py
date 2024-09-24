import json
import time

import requests

# Set the initial Unix timestamp
timestamp = 1719180000

# Set the headers for the request
headers = {
    "accept": "*/*",
    "accept-language": "fr-FR,fr;q=0.9",
    "authorization": "BEARER_TOKEN_REMOVED",
    "content-type": "null",
    "if-none-match": "d1f1268639bc146e732df88e4abc9333",
    "origin": "https://app.croq-kilos.com",
    "priority": "u=1, i",
    "referer": "https://app.croq-kilos.com/",
    "sec-ch-ua": '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
}

# Get the current Unix timestamp
now = int(time.time())

# Loop until the current timestamp is reached
while timestamp <= now:
    # Make the request
    url = f"https://api.croq-kilos.com/menus?day={timestamp}"
    response = requests.get(url, headers=headers)
    data = response.json()

    # Save the data to a file
    with open(f"data_{timestamp}.json", "w") as f:
        json.dump(data, f)

    # Add 4800 to the timestamp
    timestamp += 4800
