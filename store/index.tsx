import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StreamVideoClient } from "@stream-io/video-react-native-sdk";
import type { Session } from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Role = "booker" | "os" | null;

type AppContextType = {
  userSession: Session | null;
  role: Role;
  client: StreamVideoClient | null;
  loading: boolean;
  error: string | null;
  refreshKey: number;
};

const AppContext = createContext<AppContextType>({
  userSession: null,
  role: null,
  client: null,
  loading: true,
  error: null,
  refreshKey: 0,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const streamClientRef = useRef<StreamVideoClient | null>(null);

  // --- background: init stream client ---
  const initStreamClient = async (user: { id: string; email?: string }) => {
    try {
      // fetch stream token
      const resp = await fetch(
        "https://vibemate-backend.onrender.com/get-stream-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text().catch(() => "No body");
        console.warn(`Stream token fetch failed: ${resp.status} - ${text}`);
        return;
      }

      const { token } = await resp.json();

      const apiKey = "ape3y3rstefa";
      const streamUser = {
        id: user.id,
        name: user.email,
        image: "https://robohash.org/John",
      };

      if (!streamClientRef.current) {
        streamClientRef.current = new StreamVideoClient({
          apiKey,
          user: streamUser,
          token,
        });
        setClient(streamClientRef.current);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Stream init error:", error);
    }
  };

  // --- init user + role ---
  const init = async (session: Session | null, skipCache = false) => {
    try {
      if (!session?.user) {
        // no session → reset everything
        setUserSession(null);
        setRole(null);

        if (streamClientRef.current) {
          await streamClientRef.current.disconnectUser().catch(console.error);
          streamClientRef.current = null;
          setClient(null);
        }
        await AsyncStorage.removeItem("user_role");
        setLoading(false);
      } else {
        // session exists → set session
        setUserSession(session);

        // 1. Try Cache & Unblock UI immediately (Unless fresh login)
        const cachedRole = skipCache ? null : await AsyncStorage.getItem("user_role");
        if (cachedRole) {
          setRole(cachedRole as Role);
          setLoading(false);
        } else {
          // If no cache and we are not skipping, ensure we are in loading state
          // (Though loading is usually true by default on bootstrap)
        }

        // 2. Fetch Fresh Role (Background update)
        // ... (rest of the logic)
        // Add a safety timeout for the database fetch
        const profilePromise = supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Role fetch timeout")), 5000)
        );

        try {
          const { data, error: roleErr } = (await Promise.race([
            profilePromise,
            timeoutPromise,
          ])) as any;

          if (roleErr) {
            console.warn("role fetch warning:", roleErr);
            if (!cachedRole) setRole(null);
          } else {
            const freshRole = data?.role ?? null;
            if (freshRole !== role) {
              setRole(freshRole);
            }
            if (freshRole) {
              await AsyncStorage.setItem("user_role", freshRole);
            } else if (!cachedRole) {
              // Sign out if no role is found and no cache exists
              console.error("User verified but no role found in profiles table.");
              setRole(null);
            }
          }
        } catch (err) {
          console.error("Fresh role fetch failed or timed out:", err);
          if (!cachedRole) setRole(null);
        }

        // Ensure loading is off
        setLoading(false);

        // Init stream in background (don't wait for it)
        initStreamClient(session.user);
      }
    } catch (err) {
      console.error("AppProvider init error:", err);
      setError(err instanceof Error ? err.message : "Init failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) await init(session);
      } catch (err) {
        console.error("bootstrap error", err);
        setLoading(false);
      }
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_OUT") {
          await init(null);
        } else if (event === "SIGNED_IN") {
          // Fresh login → skip cache to prevent flashing previous user's role
          await init(session, true);
        } else if (event === "TOKEN_REFRESHED") {
          await init(session);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      if (streamClientRef.current) {
        streamClientRef.current.disconnectUser().catch(console.error);
        streamClientRef.current = null;
      }
    };
  }, []);

  console.log("AppProvider state:", {
    loading,
    hasSession: !!userSession,
    role,
    hasClient: !!client,
    error,
  });

  return (
    <AppContext.Provider
      value={{ userSession, role, client, loading, error, refreshKey }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
