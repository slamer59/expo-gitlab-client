import * as Application from 'expo-application';
import { router } from "expo-router";
import { Platform } from "react-native";


const getIssueDescription = () => {
    return encodeURIComponent(
        `## App Information\n` +
        `- App Version: ${Application.applicationName} v${Application.nativeBuildVersion}\n` +
        `- Platform: ${Platform.OS}\n` +
        `- OS Version: ${Platform.Version}\n` +
        `- GitLab API: v4\n\n` +
        `## Feedback\n` +
        `<!-- Please describe your feedback, issue, or suggestion here -->\n\n` +
        `## Steps to Reproduce (if applicable)\n` +
        `1. \n2. \n3. \n\n` +
        `## Expected Behavior\n\n` +
        `## Actual Behavior\n\n` +
        `## Additional Information\n`
    );
};

export const handleFeedback = () => {
    router.push({
        pathname: '/workspace/projects/[projectId]/issues/create',
        params: {
            projectId: '62930051',
            title: 'Feedback: Gitalchemy Mobile App',
            description: getIssueDescription()
        }
    });
};

export const supportLinks = [
    {
        icon: "heart-outline",
        text: "Support on Patreon",
        url: "https://www.patreon.com/c/teepeetlse",
        color: "#FF424D",
        external: true,
        testID: "support-patreon"
    },
    {
        icon: "cafe-outline",
        text: "Buy Me a Coffee",
        url: "https://buymeacoffee.com/thomaspedo6",
        color: "#FFDD00",
        external: true,
        testID: "support-buymeacoffee"
    },
    {
        icon: "globe-outline",
        text: "Visit Website",
        url: "https://thomaspedot.dev",
        color: "#0085CA",
        external: true,
        testID: "visit-website"
    },
    {
        icon: "star-outline",
        text: "Rate on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.thomas.pedot.expogitlabclient",
        color: "#34A853",
        external: true,
        testID: "rate-google-play"
    },
    {
        icon: "chatbubble-outline",
        text: "Submit Feedback",
        onPress: handleFeedback,
        color: "#FC6D26",
        external: false,
        testID: "submit-feedback"
    }
];