import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const DashboardStats = () => {
  const dateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  };

  const [stats, setStats] = useState({
    kpis: {},
    activityData: [],
    permissionStats: [],
    roleData: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));

        const params = {
          start_date: dateRange.start.toISOString().split('T')[0],
          end_date: dateRange.end.toISOString().split('T')[0]
        };

        const [statsRes, activityRes, permissionsRes] = await Promise.all([
          axios.get('/admin/stats', { params }),
          axios.get('/admin/activity-data', { params }),
          axios.get('/admin/permission-stats', { params })
        ]);

        setStats({
          kpis: statsRes.data.kpis || {},
          activityData: activityRes.data || [],
          permissionStats: permissionsRes.data || [],
          roleData: [
            { name: 'Admins', value: statsRes.data.adminCount || 0 },
            { name: 'Utilisateurs', value: statsRes.data.userCount || 0 }
          ],
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [dateRange.start, dateRange.end]);

  return (
    <div>
      {stats.loading ? (
        <p>Chargement...</p>
      ) : (
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      )}
    </div>
  );
};

export default DashboardStats;
