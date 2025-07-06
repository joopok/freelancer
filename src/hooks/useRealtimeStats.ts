import { useState, useEffect, useCallback } from 'react';
import wsService, { RealtimeStats, RealtimeUpdate } from '@/services/websocket';

interface UseRealtimeStatsOptions {
  projectId?: string;
  freelancerId?: string;
  initialStats?: Partial<RealtimeStats>;
  enableWebSocket?: boolean;
}

interface UseRealtimeStatsReturn {
  stats: RealtimeStats;
  connected: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  updateStats: (updates: Partial<RealtimeStats>) => void;
  retry: () => void;
}

export function useRealtimeStats({
  projectId,
  freelancerId,
  initialStats = {},
  enableWebSocket = true
}: UseRealtimeStatsOptions): UseRealtimeStatsReturn {
  const [stats, setStats] = useState<RealtimeStats>({
    viewCount: initialStats.viewCount || 0,
    currentViewers: initialStats.currentViewers || 1,
    applicationsCount: initialStats.applicationsCount || 0,
    bookmarkCount: initialStats.bookmarkCount || 0,
    inquiryCount: initialStats.inquiryCount || 0
  });
  
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Update stats manually
  const updateStats = useCallback((updates: Partial<RealtimeStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle realtime updates
  const handleRealtimeUpdate = useCallback((update: RealtimeUpdate) => {
    console.log('📊 Handling realtime update:', update);
    
    if (update.data) {
      setStats(prev => ({
        ...prev,
        ...update.data
      }));
    }

    // Handle specific update types
    switch (update.type) {
      case 'viewer_join':
        setStats(prev => ({
          ...prev,
          currentViewers: Math.max(1, (prev.currentViewers || 0) + 1)
        }));
        break;
      
      case 'viewer_leave':
        setStats(prev => ({
          ...prev,
          currentViewers: Math.max(1, (prev.currentViewers || 1) - 1)
        }));
        break;
      
      case 'application':
        setStats(prev => ({
          ...prev,
          applicationsCount: (prev.applicationsCount || 0) + 1
        }));
        break;
      
      case 'bookmark':
        setStats(prev => ({
          ...prev,
          bookmarkCount: (prev.bookmarkCount || 0) + 1
        }));
        break;
      
      case 'inquiry':
        setStats(prev => ({
          ...prev,
          inquiryCount: (prev.inquiryCount || 0) + 1
        }));
        break;
    }
  }, []);

  // Manual retry function
  const retry = useCallback(() => {
    if (!wsService.isConnected()) {
      setConnectionStatus('connecting');
      wsService.connect();
    }
  }, []);

  useEffect(() => {
    if (!enableWebSocket) return;

    // Connect to WebSocket if not already connected
    if (!wsService.isConnected()) {
      setConnectionStatus('connecting');
      wsService.connect();
    }

    // Check connection status
    const checkConnection = () => {
      const isConnected = wsService.isConnected();
      setConnected(isConnected);
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };

    checkConnection();

    // Join appropriate room
    if (projectId) {
      wsService.joinProject(projectId);
    } else if (freelancerId) {
      wsService.joinFreelancer(freelancerId);
    }

    // Subscribe to updates
    const key = projectId || freelancerId || 'global';
    const unsubscribe = wsService.subscribe(key, handleRealtimeUpdate);

    // Subscribe to connection status changes
    const statusUnsubscribe = wsService.subscribeToConnectionStatus((status) => {
      setConnected(status === 'connected');
      setConnectionStatus(status);
    });

    // Periodically check connection status
    const statusInterval = setInterval(checkConnection, 5000);

    // Cleanup
    return () => {
      unsubscribe();
      statusUnsubscribe();
      clearInterval(statusInterval);
      
      if (projectId) {
        wsService.leaveProject(projectId);
      } else if (freelancerId) {
        wsService.leaveFreelancer(freelancerId);
      }
    };
  }, [projectId, freelancerId, enableWebSocket, handleRealtimeUpdate]);

  // Fallback: Simulate realtime updates if WebSocket is not available
  useEffect(() => {
    if (!enableWebSocket || connected) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentViewers: Math.max(1, prev.currentViewers + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [connected, enableWebSocket]);

  return {
    stats,
    connected,
    connectionStatus,
    updateStats,
    retry
  };
}