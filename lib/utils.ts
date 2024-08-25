import { clsx, type ClassValue } from 'clsx';
import * as SecureStore from 'expo-secure-store';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getToken() {
  let result = await SecureStore.getItemAsync('gitlab-token');

  if (result) {
    console.log('Token successfully loaded');
    return result;
  } else {
    console.log('No token stored');
    return null;
  }
}

export async function checkValidity(token: string | null) {
  console.log('Checking token validity...');
  if (!token) {
    console.log('No token provided');
    return false;
  }
  try {
    const response = await fetch('https://gitlab.com/api/v4/user', {
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
  await SecureStore.deleteItemAsync('gitlab-token')
  console.log('gitlab-token has been removed');
};


export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
