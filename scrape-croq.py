import json
import time

import requests

# Set the initial Unix timestamp
timestamp = 1719180000

# Set the headers for the request
headers = {
    "accept": "*/*",
    "accept-language": "fr-FR,fr;q=0.9",
    "authorization": "Bearer ***REMOVED***.bmnmhbbh-BL_p1G71QDcjAgwoEzJCbX0rt9Qo2nsCMMzFIoaiSGKe8xKenuEkHb--FpKJZ22ira_RO5rWut-Rb0sbP1xre4sa8NIEX9A5MCAUf0llx4ZxxJxz-PcQXGz8l1YMVgd6LbuBegzZ4riW5q0hgO0x0yJ9sbO48qRe_p6qkgH4lT48vGMiUXYPlYhYSPuUiDKh6ub706dacllW_tUDaGXrK2BkeTshA6iS2dNXEn38biy0voNdd3GtlMdDpG6VUt1aAjTpo_VvdpmdLCpU1cDyKgwcRJ-UUEtiVYwbX11iX97gqna9DHZlejELOIpSd-t0JRe-kwl7Jw6uJBIqJ5chxTxZzitSQY-O3FO8xaiz7i1-VhvvobntAkepxaalYh2TC-ma8XciF7n8PmIn2RpZWs_wAk6IhBPIPh35JJ6VNNSD5jK-A_ngcReZlPKvM_iQEWmNEPCfQ3CrlPI-lg59tpZ4ENK2sdpmJDwrO6zM2ne_NMkzsDG8DuAeJ3hkKHpgMaKS1X-u_sAo84Ei4cgZ-ID5Jy91fZ4V4THn23RsKxomQRgLVOgvJOJEQNnyjSt8Q5ZUXY1mtlu6hf8EVT-AqCmfKWy9o6PIgp-iwgb4Dhx4XWlCKQPjxil04K2ZrcsESUeB7HnQj9aC9GXwl92BS6FotF23BYGHFA",
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
