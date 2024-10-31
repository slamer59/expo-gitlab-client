import requests

# The base URL of your GitLab instance
base_url = "https://gitlab.com"

# Your private token or personal token
private_token = "REDACTED"

# The headers for the API request
headers = {"PRIVATE-TOKEN": private_token}

# The API endpoint for listing all projects
projects_endpoint = f"{base_url}/api/v4/projects"

# Send the API request to get all projects
projects_response = requests.get(projects_endpoint, headers=headers)

# If the response is successful, list and delete webhooks for each project
if projects_response.status_code == 200:
    for project in projects_response.json():
        project_id = project["id"]
        print(f"Project ID: {project_id}")

        # The API endpoint for listing all webhooks
        hooks_endpoint = f"{base_url}/api/v4/projects/{project_id}/hooks"
        print(hooks_endpoint)
        # Send the API request to get all webhooks
        hooks_response = requests.get(hooks_endpoint, headers=headers)
        print(hooks_response)
        # If the response is successful, delete each webhook
        if hooks_response.status_code == 200:
            for hook in hooks_response.json():
                hook_id = hook["id"]
                delete_endpoint = (
                    f"{base_url}/api/v4/projects/{project_id}/hooks/{hook_id}"
                )
                print(f"Deleting hook with ID {hook_id}...")
                # delete_response = requests.delete(delete_endpoint, headers=headers)
                # print(f"Deleted hook with ID {hook_id}. Response: {delete_response.status_code}")
        else:
            print(
                f"Failed to get webhooks for project ID {project_id}. Response: {hooks_response.status_code}"
            )
else:
    print(f"Failed to get projects. Response: {projects_response.status_code}")
