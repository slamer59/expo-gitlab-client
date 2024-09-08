import { clsx, type ClassValue } from "clsx";
import * as SecureStore from "expo-secure-store";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getToken() {
  let result = await SecureStore.getItemAsync('gitlab-token');

  if (result) {
    // console.log("Token successfully loaded");
    return result;
  } else {
    console.log("No token stored");
    return null;
  }
}

export async function checkValidity(serverUrl: string, token: string | null) {
  console.log('Checking token validity...');
  if (!token) {
    console.log('No token provided');
    return false;
  }
  try {
    const response = await fetch(`${serverUrl}/api/v4/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log('Token is valid');
      return true;
    } else {
      console.log('Token is invalid');
      await resetToken();
      return false;
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}

export async function resetToken() {
  await SecureStore.deleteItemAsync("gitlab-token");
  console.log("gitlab-token has been removed");
}

// export function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

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