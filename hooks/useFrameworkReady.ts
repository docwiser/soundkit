import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Safely check if window exists and frameworkReady is a function
    if (typeof window !== 'undefined' && typeof window.frameworkReady === 'function') {
      window.frameworkReady();
    }
  }, []); // Add empty dependency array to run only once
}