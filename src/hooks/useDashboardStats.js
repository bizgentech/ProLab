import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadStats();
  };

  return {
    stats,
    loading,
    error,
    refresh
  };
}