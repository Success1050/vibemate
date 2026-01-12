// /context/index.tsx  (or wherever you keep your AuthProvider)
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type Role = "booker" | "os" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  setauth: (authUser: User | null) => void;
  setUserData: (userData: Record<string, any>) => void;
  setUserRole: (r: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  setauth: () => { },
  setUserData: () => { },
  setUserRole: () => { },
  logout: async () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);

  const setauth = (authUser: User | null) => {
    setUser(authUser);
    if (!authUser) {
      setRole(null);
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // 2. Listen for Auth Changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Accept any shape (profile returned from profiles table) and set role if present
  const setUserData = (userData: Record<string, any>) => {
    if (!userData) return;
    // If a role is present in the profile, set it
    if (userData.role) {
      setRole(userData.role as Role);
    } else if (userData.userRole) {
      // some apps store custom metadata as userRole
      setRole(userData.userRole as Role);
    }
    // Merge user metadata lightly (if user exists)
    if (user && userData) {
      // @ts-ignore - supabase User type may not accept arbitrary keys; keep shallow merge
      setUser({ ...user, ...userData });
    }
  };

  const setUserRole = (userRole: Role) => {
    setRole(userRole);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, setauth, setUserData, setUserRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
