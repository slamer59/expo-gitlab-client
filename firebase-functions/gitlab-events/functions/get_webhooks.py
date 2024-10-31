import requests

base_url = "https://gitlab.com"

private_token = "REDACTED"

# The ID of the project you want to add the webhook to
project_id = "59853773"


def get_webhooks(project_id, private_token):
    url = f"{base_url}/api/v4/projects/{project_id}/hooks"
    headers = {"PRIVATE-TOKEN": private_token}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(
            f"Error getting webhooks: {response.status_code} {response.text}"
        )


print(get_webhooks(project_id, private_token))
