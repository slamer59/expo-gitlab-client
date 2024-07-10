import { clsx, type ClassValue } from 'clsx';
import * as SecureStore from 'expo-secure-store';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getToken() {
  let result = await SecureStore.getItemAsync('token');
  if (result) {
    console.log('Token successfully loaded');
    return result;
  } else {
    console.log('No token stored');
    return null;
  }
}