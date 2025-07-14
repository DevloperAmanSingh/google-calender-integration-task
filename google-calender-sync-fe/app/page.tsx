"use client";
import { Header } from "@/components/header";
import { SignInSection } from "@/components/sign-in-section";
import { SyncControls } from "@/components/sync-controls";
import { EventsList } from "@/components/events-list";
import { NotificationAlert } from "@/components/notification";
import { useCalendarSync } from "@/hooks/use-calendar-sync";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Notification {
  type: "success" | "error" | "info";
  message: string;
}

export default function GoogleCalendarSyncPage() {
  const {
    isSignedIn,
    isLoading,
    events,
    notification,
    signIn,
    syncEvents,
    startPolling,
    stopPolling,
  } = useCalendarSync();

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userEmail: null as string | null,
    isInitialized: false,
  });
  const [localNotification, setLocalNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    const email = Cookies.get("user_email");
    if (email) {
      setAuthState({
        isAuthenticated: true,
        userEmail: email,
        isInitialized: true,
      });
      setLocalNotification({
        type: "success",
        message: `✅ Signed in as ${email}`,
      });
      startPolling();
    } else {
      setAuthState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, []);

  const handleSignIn = async () => {
    try {
      window.location.href = "/api/auth";
    } catch (error) {
      setLocalNotification({
        type: "error",
        message: "❌ Failed to sign in. Please try again.",
      });
    }
  };

  const handleSignOut = () => {
    Cookies.remove("user_email");
    setAuthState({
      isAuthenticated: false,
      userEmail: null,
      isInitialized: true,
    });
    setLocalNotification({
      type: "info",
      message: "👋 Signed out successfully",
    });
    stopPolling();
  };

  useEffect(() => {
    if (localNotification) {
      const timer = setTimeout(() => {
        setLocalNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [localNotification]);
  if (!authState.isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />

        {!authState.isAuthenticated && (
          <SignInSection onSignIn={handleSignIn} isLoading={isLoading} />
        )}

        {authState.isAuthenticated && (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Welcome back!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Signed in as:{" "}
                    <span className="font-medium">{authState.userEmail}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🔄 Auto-syncing every 5 seconds
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {(localNotification || notification) && (
              <NotificationAlert
                notification={localNotification || notification!}
              />
            )}

            <SyncControls onSync={syncEvents} isLoading={isLoading} />
            <EventsList events={events} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
}
