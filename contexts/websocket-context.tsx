"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { GeoRankWebSocket } from "@/lib/websocket";

type SocketState = {
  isConnected: boolean;
  ws: GeoRankWebSocket | null;
};

const defaultState: SocketState = { isConnected: false, ws: null };
const WebSocketContext = createContext<SocketState>(defaultState);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = new GeoRankWebSocket();
    const connect = () => setState({ isConnected: true, ws });
    const disconnect = () => setState({ isConnected: false, ws });
    ws.on("connected", connect);
    ws.on("disconnected", disconnect);
    ws.connect(token);

    return () => {
      ws.off("connected", connect);
      ws.off("disconnected", disconnect);
      ws.disconnect();
    };
  }, []);

  return <WebSocketContext.Provider value={state}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
