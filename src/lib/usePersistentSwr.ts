import useSWR, { SWRConfiguration } from "swr";

// Custom cache provider using localStorage
export const localStorageProvider = () => {
  const isClient = typeof window !== "undefined";

  // Initialize the cache from localStorage
  const map = new Map<string, unknown>(
    isClient ? JSON.parse(localStorage.getItem("swr-cache") || "[]") : []
  );

  // Listen for changes to the cache and update localStorage
  if (isClient) {
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "swr-cache",
        JSON.stringify(Array.from(map.entries()))
      );
    });
  }

  return map
};


// Define the fetcher function
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Something went wrong, try again later");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error(String(error));
  }
};

// SWR Configuration Options
const swrOptions: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  dedupingInterval: 30 * 60 * 1000, // 30 minutes
  focusThrottleInterval: 30 * 60 * 1000, // 30 minutes
};

// Custom Hook
export function usePersistentSWR<T>(key: string, url: string) {
  return useSWR<T>(key, () => fetcher(url), swrOptions);
}
