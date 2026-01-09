import { supabase } from "@/lib/supabase";
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

  // --- init user + role + stream client ---
  const init = async (session: Session | null) => {
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
      } else {
        // session exists → set session
        setUserSession(session);

        // fetch role
        const { data, error: roleErr } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roleErr) {
          console.warn("role fetch warning:", roleErr);
          setRole(null);
        } else {
          setRole((data as any)?.role ?? null);
        }

        // fetch stream token
        const resp = await fetch(
          "https://vibemate-backend.onrender.com/get-stream-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session.user.id }),
          }
        );

        if (!resp.ok) {
          const text = await resp.text().catch(() => "No body");
          throw new Error(
            `Stream token fetch failed: ${resp.status} ${resp.statusText} → ${text}`
          );
        }

        const { token } = await resp.json();

        const apiKey = "ape3y3rstefa";
        const user = {
          id: session.user.id,
          name: session.user.email,
          image: "https://robohash.org/John",
        };

        if (!streamClientRef.current) {
          streamClientRef.current = new StreamVideoClient({
            apiKey,
            user,
            token,
          });
          setClient(streamClientRef.current);
          setRefreshKey((prev) => prev + 1); // 👈 force rerender when client ready
        }
      }
    } catch (err) {
      console.error("AppProvider init error:", err);
      setError(err instanceof Error ? err.message : "Init failed");
    } finally {
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
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
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
