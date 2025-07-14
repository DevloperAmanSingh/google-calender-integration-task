"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import type { CalendarSyncState, Notification } from "@/types/calendar";

export function useCalendarSync() {
  const [state, setState] = useState<CalendarSyncState>({
    isSignedIn: false,
    isLoading: false,
    events: [],
    notification: null,
  });

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for authentication on hook initialization
  useEffect(() => {
    const email = Cookies.get("user_email");
    if (email) {
      setState((prev) => ({
        ...prev,
        isSignedIn: true,
      }));
    }
  }, []);

  const setNotification = useCallback((notification: Notification | null) => {
    setState((prev) => ({ ...prev, notification }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  // Real API call to fetch events
  const fetchEvents = useCallback(
    async (showLoadingIndicator = true) => {
      try {
        if (showLoadingIndicator) {
          setLoading(true);
          setNotification({
            type: "info",
            message: "🔄 Syncing calendar events...",
          });
        }

        const response = await fetch("http://localhost:3000/events", {
          credentials: "include", // Include cookies
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Not authenticated");
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const events = data.events || [];

        setState((prev) => ({
          ...prev,
          events: events.map((event: any) => ({
            id: event.id,
            title: event.summary || "No Title",
            dateTime: event.start?.dateTime || event.start?.date || "",
            status: "Created" as const,
          })),
          isLoading: false,
        }));

        if (showLoadingIndicator) {
          setNotification({
            type: "success",
            message: `✅ Synced ${events.length} events successfully ${
              data.cached ? "(cached)" : ""
            }`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        if (showLoadingIndicator) {
          setNotification({
            type: "error",
            message:
              error instanceof Error
                ? `❌ ${error.message}`
                : "❌ Failed to fetch events",
          });
        }
      }
    },
    [setLoading, setNotification]
  );

  // Start smart polling every 5 seconds
  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Initial fetch with loading indicator
    fetchEvents(true);

    // Set up polling every 5 seconds (without loading indicator for background updates)
    pollingIntervalRef.current = setInterval(() => {
      fetchEvents(false);
    }, 5000);
  }, [fetchEvents]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Manual sync (with loading indicator)
  const syncEvents = useCallback(() => {
    fetchEvents(true);
  }, [fetchEvents]);

  // Placeholder for Google OAuth flow
  const signIn = async () => {
    setLoading(true);
    window.location.href = "/api/auth";
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    ...state,
    signIn,
    syncEvents,
    setNotification,
    startPolling,
    stopPolling,
  };
}
