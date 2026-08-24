import { useState, useEffect, useCallback } from 'react';
import { AttractionWaitTime, generateLiveWaitTimes } from '../data/waitTimes';

export interface LiveWaitTimesState {
  waitTimes: Record<string, AttractionWaitTime>;
  isLoading: boolean;
  isLiveAPI: boolean;
  lastUpdated: string;
  parkOpen: boolean;
  refresh: () => Promise<void>;
}

export function useLiveWaitTimes(autoRefreshSeconds = 60): LiveWaitTimesState {
  const [waitTimes, setWaitTimes] = useState<Record<string, AttractionWaitTime>>(() =>
    generateLiveWaitTimes(0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveAPI, setIsLiveAPI] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });
  const [parkOpen, setParkOpen] = useState(true);

  const fetchLiveTimes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wait-times');
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      if (data && data.times && typeof data.times === 'object') {
        setWaitTimes(data.times);
        setIsLiveAPI(Boolean(data.isLiveOfficial));
        setParkOpen(data.parkOpen ?? true);
        if (data.updatedAt) {
          const d = new Date(data.updatedAt);
          setLastUpdated(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
        }
      }
    } catch (err) {
      console.warn('Fallback to local intelligent live queue times:', err);
      setWaitTimes(generateLiveWaitTimes(Date.now() % 10));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    fetchLiveTimes();
  }, [fetchLiveTimes]);

  // Auto refresh interval
  useEffect(() => {
    if (!autoRefreshSeconds || autoRefreshSeconds <= 0) return;
    const interval = setInterval(fetchLiveTimes, autoRefreshSeconds * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshSeconds, fetchLiveTimes]);

  return {
    waitTimes,
    isLoading,
    isLiveAPI,
    lastUpdated,
    parkOpen,
    refresh: fetchLiveTimes,
  };
}
