import * as Notifications from "expo-notifications";
import { getToken } from "../utils";

const baseUrl = "https://gitlab.com";
export async function getProjects(): Promise<any> {
    const savedToken = await getToken();

    if (savedToken) {
        try {
            const headers = {
                "PRIVATE-TOKEN": savedToken,
            };
            const params = {
                membership: "true",
            };
            const response = await fetch(
                `${baseUrl}/api/v4/projects` +
                "?" +
                new URLSearchParams(params),
                {
                    method: "GET",
                    headers,
                }
            );

            if (!response.ok) {
                navigation.navigate("login");
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Gitlab API response");
            const projects = data.map(
                (project: { http_url_to_repo: string; id: int }) => {
                    return {
                        http_url_to_repo: project.http_url_to_repo,
                        id: project.id
                    }
                }
            );
            return projects;
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.log("No token found");
    }
}

export async function expoToken() {
    let token = await Notifications.getExpoPushTokenAsync();
    return token.data;
}