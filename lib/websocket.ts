type EventHandler = (data: unknown) => void;

interface WebSocketMessage {
  event: string;
  data: unknown;
}

const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const INITIAL_RECONNECT_DELAY = 1000; // 1 second

/**
 * WebSocket singleton class for real-time communication.
 * Connects to the backend WS endpoint with JWT authentication.
 * Auto-reconnects with exponential backoff (1s -> 2s -> 4s -> 8s -> 16s -> 30s max).
 */
export class GeoRankWebSocket {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectDelay = INITIAL_RECONNECT_DELAY;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  /**
   * Register an event handler
   */
  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Remove an event handler
   */
  off(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Connect to the WebSocket server
   */
  connect(token: string): void {
    this.token = token;
    this.intentionalClose = false;
    this.createConnection();
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private createConnection(): void {
    if (!this.token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/api$/, '');
    const wsUrl = `${wsProtocol}://${host}/api/ws?token=${this.token}`;

    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectDelay = INITIAL_RECONNECT_DELAY;
      this.emit('connected', {});
    };

    this.ws.onclose = () => {
      this.emit('disconnected', {});
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      // onclose will fire after onerror, so reconnect is handled there
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (message.event) {
          this.emit(message.event, message.data);
        }
      } catch {
        // Ignore malformed messages
      }
    };
  }

  private emit(event: string, data: unknown): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch {
          // Ignore handler errors
        }
      });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.createConnection();
    }, this.reconnectDelay);

    // Exponential backoff: 1s -> 2s -> 4s -> 8s -> 16s -> 30s max
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
  }
}
