import { clsx, type ClassValue } from "clsx";
import * as SecureStore from "expo-secure-store";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getToken() {
  let result = await SecureStore.getItemAsync("gitlab-token");

  if (result) {
    console.log("Token successfully loaded");
    return result;
  } else {
    console.log("No token stored");
    return null;
  }
}

export async function resetToken() {
  await SecureStore.deleteItemAsync("gitlab-token");
  console.log("gitlab-token has been removed");
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRandomHexColor() {
  // Generate a random number between 0 and 16777215 (which is 0xFFFFFF in decimal)
  const randomNumber = Math.floor(Math.random() * 0xffffff);

  // Convert the number to a hexadecimal string and pad it with leading zeros if necessary
  const hexString = randomNumber.toString(16).padStart(6, "0");

  // Return the hex color code with a '#' prefix
  return `#${hexString}`;
}
