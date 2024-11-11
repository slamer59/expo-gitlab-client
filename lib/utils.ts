import { clsx, type ClassValue } from "clsx";
import * as Clipboard from 'expo-clipboard';
import { MutableRefObject, SetStateAction } from "react";


import { Alert, Share } from "react-native";
import { twMerge } from "tailwind-merge";
import { getExpoToken } from "./notification/utils";

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


export const tapForExpoToken = async (
  tapCount: number,
  setTapCount: (value: SetStateAction<number>) => void,
  lastTapTimeRef: MutableRefObject<number>
) => {
  const now = new Date().getTime();
  const DOUBLE_PRESS_DELAY = 300;

  if (now - lastTapTimeRef.current < DOUBLE_PRESS_DELAY) {
    setTapCount(prev => {
      return prev + 1
    })
    if (tapCount === 4) {
      try {
        const token = await getExpoToken();
        await Clipboard.setStringAsync(token);
        // alert('Expo token copied to clipboard');
        return `Expo token copied to clipboard : \n ${token}`
      } catch (error) {
        console.error('Failed to copy Expo token:', error);
      }
      setTapCount(0);
    }
  } else {
    setTapCount(1);
  }
  lastTapTimeRef.current = now;
};


export function extractDefaultFilters(filters) {
  const defaultFilters = {};

  filters.forEach(filterGroup => {
    filterGroup.options.forEach(option => {
      if (option.default) {
        Object.assign(defaultFilters, option.filter);
      }
    });
  });

  return defaultFilters;
}

export function extractDefaultUIOptions(filters) {
  const defaultOptions = {};

  filters.forEach(filter => {
    const defaultOption = filter.options.find(option => option.default === true);
    if (defaultOption) {
      defaultOptions[filter.label] = {
        label: defaultOption.label,
        value: defaultOption.value
      };
    }
  });

  return defaultOptions;
}

export const calculateFileChanges = (change) => {
  // Default values
  let additions = 0;
  let deletions = 0;
  let status = 'modified';

  if (change.new_file) {
    status = 'new';
    additions = change.new_lines || 0;
  } else if (change.deleted_file) {
    status = 'deleted';
    deletions = change.old_lines || 0;
  }
  // Extract information from @@ patterns
  const chunkHeaders = change.diff.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/g);

  if (chunkHeaders) {
    chunkHeaders.forEach(header => {
      const [, oldStart, oldLines, newStart, newLines] = header.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);

      deletions += parseInt(oldLines) || 0;
      additions += parseInt(newLines) || 0;
    });
  }
  return {
    additions,
    deletions,
    total_changes: additions + deletions,
    status
  };
};