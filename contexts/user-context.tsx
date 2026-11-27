"use client";

import { createContext, useContext } from "react";
import type { MeResponse } from "@/lib/api";

const UserContext = createContext<MeResponse | null>(null);

interface UserProviderProps {
  user: MeResponse;
  children: React.ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
}
