"use client"; // Mark this component as a Client Component

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  useEffect(() => {
    async function refreshSession() {
      const sessionData = localStorage.getItem("supabaseSession");
      const session = sessionData ? JSON.parse(sessionData) : null;
      if (session) {
        const { data, error } = await supabase.auth.refreshSession(session);

        if (data) {
          // Update session data in local storage
          localStorage.setItem("supabaseSession", JSON.stringify(data.session));
        } else if (error) {
          // Handle error
          console.error("Error refreshing session:", error);
        }
      }
    }

    // Call refreshSession when the dashboard page loads
    refreshSession();

    // Set up a periodic refresh (e.g., every 9 days)
    const intervalId = setInterval(refreshSession, 9 * 24 * 60 * 60 * 1000); // 9 days in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
}
