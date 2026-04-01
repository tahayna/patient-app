import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { setAuthToken, apiRequest, queryClient } from "@/lib/query-client";

const TOKEN_KEY = "dental_patient_token";

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: string;
  patientId: number | null;
  branchId: number | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function clearToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadToken();
        if (stored) {
          setAuthToken(stored);
          const me = await apiRequest<{ user: AuthUser }>("GET", "/api/auth/me");
          setToken(stored);
          setUser(me.user);
        }
      } catch {
        await clearToken();
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: AuthUser }>(
      "POST",
      "/api/auth/login",
      { email, password }
    );
    await saveToken(data.token);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await clearToken();
    setAuthToken(null);
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
