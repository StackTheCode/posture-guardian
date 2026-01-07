import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Award, RefreshCw, } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { useWeeklyAnalytics } from '../hooks/useWeeklyAnalytics';

export const AnalyticsPage = () => {
  const { analytics, loading, error } = useWeeklyAnalytics();

  if (loading) {
    return (
      <div className='min-h-screen p-6 flex items-center justify-center'>
        <div className="glass-strong rounded-2xl p-8 flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-slate-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className='min-h-screen p-6 flex items-center justify-center'>
        <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">Failed to load analytics</p>
          <p className="text-slate-400 text-sm">{error || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 glass px-6 py-3 rounded-xl hover:glass-strong transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Generate dynamic insights cards
  const insightCards = [
    {
      icon: TrendingUp,
      title: analytics.goodPosturePercentage >= 70 ? 'Improving' : 'Needs Work',
      description: `${analytics.goodPosturePercentage.toFixed(0)}% good posture this week`,
      color: analytics.goodPosturePercentage >= 70 ? 'text-green-400' : 'text-yellow-400',
      bg: analytics.goodPosturePercentage >= 70 
        ? 'from-green-500/20 to-emerald-500/20' 
        : 'from-yellow-500/20 to-orange-500/20'
    },
    {
      icon: Calendar,
      title: 'Best Day',
      description: (() => {
  // 1. Safety check: If no data, return a placeholder
  if (!analytics.weeklyData || analytics.weeklyData.length === 0) {
    return "No data recorded yet";
  }

  // 2. Provide the first element as the starting point for reduce
  const bestDay = analytics.weeklyData.reduce((prev, current) => 
    (current.goodPercentage > prev.goodPercentage) ? current : prev,
    analytics.weeklyData[0] // Initial value
  );
  
  return `${bestDay.day} - ${bestDay.goodPercentage.toFixed(0)}% good posture`;
})(),
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: TrendingDown,
      title: 'Watch Out',
      description: analytics.insights[1] || 'Keep monitoring your posture',
      color: 'text-yellow-400',
      bg: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      icon: Award,
      title: 'Total Sessions',
      description: `${analytics.totalEvents} posture checks this week`,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-pink-500/20'
    },
  ];

  return (
    <div className='min-h-screen p-6 flex flex-col gap-10'>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-slate-400 mt-1">
          Detailed insights into your posture habits over the last 7 days
        </p>
      </motion.div>

      {/* Insight Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        {insightCards.map((insight, index) => (
          <motion.div 
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className={`bg-linear-to-br ${insight.bg}`}>
              <div className='flex items-start gap-4'>
                <div className={`p-3 glass rounded-xl ${insight.color}`}>
                  <insight.icon className='w-6 h-6' />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-300">{insight.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        {/* Weekly Comparison */}
        <GlassCard>
          <h2 className='text-xl font-semibold mb-4'>Weekly Comparison</h2>
          {analytics.weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="good" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="bad" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </GlassCard>

        {/* Posture Distribution */}
        <GlassCard>
          <h2 className='text-xl font-semibold mb-4'>Posture Distribution</h2>
          {analytics.postureDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={analytics.postureDistribution.map(item => ({...item}))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.postureDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </GlassCard>
      </div>

      {/* Personalized Recommendations */}
      <GlassCard>
        <h2 className='text-xl font-semibold mb-4'>Personalized Recommendations</h2>
        <div className='space-y-4'>
          {analytics.insights.map((insight, index) => (
            <motion.div 
              key={index}
              whileHover={{ x: 5 }} 
              className='glass p-4 rounded-xl flex items-start gap-3'
            >
              <div className={`w-8 h-8 rounded-full ${
                index === 0 ? 'bg-green-500/20' : 
                index === 1 ? 'bg-blue-500/20' : 
                'bg-purple-500/20'
              } flex items-center justify-center shrink-0`}>
                <span className={`${
                  index === 0 ? 'text-green-400' : 
                  index === 1 ? 'text-blue-400' : 
                  'text-purple-400'
                } font-bold`}>{index + 1}</span>
              </div>
              <div>
                <p className="text-sm text-slate-300">{insight}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};