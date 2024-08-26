import base64

import requests

# Set the GitLab API endpoint and your private token
url = "https://gitlab.com/api/v4/projects"
headers = {"PRIVATE-TOKEN": "***REMOVED***"}

# Make the GET request to the projects endpoint with the membership parameter set to True
response = requests.get(url, headers=headers, params={"membership": "True"})

# Parse the JSON response
projects = response.json()
projects_base64 = [
    base64.b64encode(project["http_url_to_repo"].encode()).decode()
    for project in projects
]

# Print the name and path of each project
for project in projects:
    print(project["http_url_to_repo"])

print(projects_base64)
