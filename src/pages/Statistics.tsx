import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Phone, MessageCircle, Send, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DailyStats {
  date: string;
  views: number;
  phone_clicks: number;
  whatsapp_clicks: number;
  telegram_clicks: number;
}

interface ProfileStats {
  total_views: number;
  total_phone_clicks: number;
  total_whatsapp_clicks: number;
  total_telegram_clicks: number;
  daily_stats: DailyStats[];
}

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Get date range
        const now = new Date();
        let startDate = new Date();
        switch (dateRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        // Fetch profile stats
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch statistics
        const { data: statsData, error: statsError } = await supabase
          .from('profile_stats')
          .select('*')
          .eq('profile_id', profileData.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        if (statsError) throw statsError;

        // Process stats data
        const processedStats: ProfileStats = {
          total_views: 0,
          total_phone_clicks: 0,
          total_whatsapp_clicks: 0,
          total_telegram_clicks: 0,
          daily_stats: []
        };

        // Group by date and calculate totals
        const dailyStatsMap = new Map<string, DailyStats>();

        statsData.forEach(stat => {
          const date = new Date(stat.created_at).toLocaleDateString();
          
          // Update totals
          if (stat.event_type === 'view') processedStats.total_views++;
          if (stat.event_type === 'phone_click') processedStats.total_phone_clicks++;
          if (stat.event_type === 'whatsapp_click') processedStats.total_whatsapp_clicks++;
          if (stat.event_type === 'telegram_click') processedStats.total_telegram_clicks++;

          // Update daily stats
          const dailyStat = dailyStatsMap.get(date) || {
            date,
            views: 0,
            phone_clicks: 0,
            whatsapp_clicks: 0,
            telegram_clicks: 0
          };

          if (stat.event_type === 'view') dailyStat.views++;
          if (stat.event_type === 'phone_click') dailyStat.phone_clicks++;
          if (stat.event_type === 'whatsapp_click') dailyStat.whatsapp_clicks++;
          if (stat.event_type === 'telegram_click') dailyStat.telegram_clicks++;

          dailyStatsMap.set(date, dailyStat);
        });

        processedStats.daily_stats = Array.from(dailyStatsMap.values())
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setStats(processedStats);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('A apărut o eroare la încărcarea statisticilor');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, dateRange]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Se încarcă statisticile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
            Statistici Profil
          </h1>
          <p className="mt-2 text-gray-600">
            Monitorizează performanța profilului tău și interacțiunile vizitatorilor
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setDateRange('week')}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                dateRange === 'week'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ultima Săptămână
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                dateRange === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ultima Lună
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                dateRange === 'year'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ultimul An
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Views Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vizualizări</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_views}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Phone Clicks Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Click-uri Telefon</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_phone_clicks}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* WhatsApp Clicks Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Click-uri WhatsApp</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_whatsapp_clicks}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Telegram Clicks Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Click-uri Telegram</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_telegram_clicks}</p>
                  </div>
                  <div className="p-3 bg-sky-100 rounded-full">
                    <Send className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Stats Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Statistici Zilnice</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Data
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Vizualizări
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Telefon
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Telegram
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.daily_stats.map((day, index) => (
                      <tr key={day.date} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.phone_clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.whatsapp_clicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.telegram_clicks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;