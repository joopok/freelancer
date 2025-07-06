import { io, Socket } from 'socket.io-client';

export interface RealtimeStats {
  viewCount: number;
  currentViewers: number;
  applicationsCount: number;
  bookmarkCount: number;
  inquiryCount?: number;
}

export interface RealtimeUpdate {
  type: 'stats' | 'viewer_join' | 'viewer_leave' | 'application' | 'bookmark' | 'inquiry';
  projectId?: string;
  freelancerId?: string;
  data: Partial<RealtimeStats>;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: RealtimeUpdate) => void>> = new Map();
  private connectionListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(url?: string) {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket already connected');
      this.notifyConnectionStatus('connected');
      return;
    }

    // Notify connecting status
    this.notifyConnectionStatus('connecting');

    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';
    
    console.log('🔌 Connecting to WebSocket:', wsUrl);
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      auth: {
        token: localStorage.getItem('auth_token') || ''
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus('connected');
      
      // Clear any pending reconnect timer
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.notifyConnectionStatus('disconnected');
      
      // Auto-reconnect with exponential backoff
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`🔄 Attempting to reconnect in ${delay}ms...`);
        
        this.reconnectTimer = setTimeout(() => {
          this.connect();
        }, delay);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.reconnectAttempts++;
      this.notifyConnectionStatus('disconnected');
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
        this.notifyConnectionStatus('disconnected');
      }
    });

    // Listen for realtime updates
    this.socket.on('realtime_update', (update: RealtimeUpdate) => {
      console.log('📊 Realtime update received:', update);
      this.notifyListeners(update);
    });

    this.socket.on('stats_update', (update: RealtimeUpdate) => {
      console.log('📊 Stats update received:', update);
      this.notifyListeners(update);
    });
  }

  private notifyListeners(update: RealtimeUpdate) {
    const key = update.projectId || update.freelancerId || 'global';
    const listeners = this.listeners.get(key) || new Set();
    
    listeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }

  joinProject(projectId: string) {
    if (!this.socket?.connected) {
      console.warn('🔌 WebSocket not connected');
      return;
    }

    console.log('👀 Joining project room:', projectId);
    this.socket.emit('join_project', { projectId });
  }

  leaveProject(projectId: string) {
    if (!this.socket?.connected) return;

    console.log('👋 Leaving project room:', projectId);
    this.socket.emit('leave_project', { projectId });
  }

  joinFreelancer(freelancerId: string) {
    if (!this.socket?.connected) {
      console.warn('🔌 WebSocket not connected');
      return;
    }

    console.log('👀 Joining freelancer room:', freelancerId);
    this.socket.emit('join_freelancer', { freelancerId });
  }

  leaveFreelancer(freelancerId: string) {
    if (!this.socket?.connected) return;

    console.log('👋 Leaving freelancer room:', freelancerId);
    this.socket.emit('leave_freelancer', { freelancerId });
  }

  subscribe(key: string, callback: (data: RealtimeUpdate) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  sendEvent(event: string, data: any) {
    if (!this.socket?.connected) {
      console.warn('🔌 Cannot send event: WebSocket not connected');
      return;
    }

    this.socket.emit(event, data);
  }

  private notifyConnectionStatus(status: ConnectionStatus) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in connection status listener:', error);
      }
    });
  }

  subscribeToConnectionStatus(callback: (status: ConnectionStatus) => void) {
    this.connectionListeners.add(callback);
    
    // Immediately notify current status
    if (this.socket?.connected) {
      callback('connected');
    } else if (this.socket?.connecting) {
      callback('connecting');
    } else {
      callback('disconnected');
    }
    
    // Return unsubscribe function
    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.listeners.clear();
    this.connectionListeners.clear();
    this.notifyConnectionStatus('disconnected');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
const wsService = new WebSocketService();

export default wsService;