import { clsx, type ClassValue } from "clsx";


import * as Clipboard from 'expo-clipboard';
import { Alert, Share } from "react-native";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffDays < 1) {
    return `${diffHours}h`;
  } else if (diffDays < 30) {
    return `${diffDays}d`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}mo`;
  } else {
    return `${Math.floor(diffDays / 365)}y`;
  }
}



export function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (which is 0xFFFFFF in decimal)
  const randomNumber = Math.floor(Math.random() * 0xffffff);

  // Convert the number to a hexadecimal string and pad it with leading zeros if necessary
  const hexString = randomNumber.toString(16).padStart(6, "0");

  // Return the hex color code with a '#' prefix
  return `#${hexString}`;
}


// Utility functions
export const fetchUrl = async (url, token) => {
  try {
    const response = await fetch(url, {
      headers: { "PRIVATE-TOKEN": token },
    });
    if (!response.ok) throw new Error(`HTTP error on ${url} ! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};

export type IssueState = 'opened' | 'closed' | 'locked' | 'merged' | 'all';

export const getIssueStateColor = (state: IssueState): string => {
  switch (state) {
    case "opened":
      return "green";
    case "closed":
      return "red";
    case "locked":
      return "orange";
    case "merged":
      return "purple";
    case "all":
      return "blue";
    default:
      return "gray"; // Default color for unknown states
  }
};


export const copyToClipboard = async (text: string) => {
  try {
    await Clipboard.setStringAsync(text);
    // Optionally, you can show a success message
    // Alert.alert("Copied", "Text copied to clipboard");
  } catch (error) {
    console.error("Failed to copy text: ", error);
    Alert.alert("Error", "Failed to copy text to clipboard");
  }
};

export const shareView = async (url: string) => {
  try {
    const result = await Share.share({
      message: `Check out this GitLab issue: ${url}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.alert(error.message);
  }
};