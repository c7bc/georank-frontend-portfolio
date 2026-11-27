"use client";

import { WebSocketProvider } from "@/contexts/websocket-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
