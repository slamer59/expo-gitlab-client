import { mapDeviceToProjectURL } from "./constants";

export async function mapDeviceToProject(push_token: any, projects: { http_url_to_repo: string }): Promise<any> {
    console.log("Mapping device to project");
    const response = await fetch(mapDeviceToProjectURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            push_token: push_token,
            projects: projects.map(project => project.http_url_to_repo),
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Map device to project done");
    return "Map device to project done"
}

