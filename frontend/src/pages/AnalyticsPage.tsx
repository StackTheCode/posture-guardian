import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Award, } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage = () => {
  // mock data for now
  const postureDistribution = [
    { name: 'Good', value: 45, color: "#10b981" },
    { name: 'Forward Lean', value: 20, color: '#f59e0b' },
    { name: 'Slouched', value: 15, color: '#ef4444' },
    { name: 'Shoulder Tilt', value: 12, color: '#8b5cf6' },
    { name: 'Twisted', value: 8, color: '#ec4899' },
  ]
  const weeklyData = [
    { day: 'Mon', good: 65, bad: 35 },
    { day: 'Tue', good: 70, bad: 30 },
    { day: 'Wed', good: 58, bad: 42 },
    { day: 'Thu', good: 75, bad: 25 },
    { day: 'Fri', good: 62, bad: 38 },
    { day: 'Sat', good: 80, bad: 20 },
    { day: 'Sun', good: 85, bad: 15 },
  ];
  const insights = [
    {
      icon: TrendingUp,
      title: 'Improving',
      description: '+12% better posture vs last week',
      color: 'text-green-400',
      bg: 'from-green-500/20 to-emerald-500/20'
    },
    {
      icon: Calendar,
      title: 'Best Day',
      description: 'Sunday - 85% good posture',
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: TrendingDown,
      title: 'Watch Out',
      description: 'Most slouching after 3 PM',
      color: 'text-yellow-400',
      bg: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      icon: Award,
      title: 'Streak',
      description: '5 days of improvement',
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
        <p className="text-slate-400 mt-1">Detailed insights into your posture habits</p>
      </motion.div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        {insights.map((insight) => (
          <motion.div initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
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


      <div className='grid grid-cols-3 lg:grid-cols-2 gap-6  mb-6'>
        <GlassCard>
          <h2 className='text-xl font-semibold mb-4'>Weekly comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
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
        </GlassCard>


        {/* Posture distribution */}
        <GlassCard>
          <h2 className='text-xl font-semibold mb-4'>Posture Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart >
              <Pie data={postureDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"

              >
                {postureDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

      </div>


 <GlassCard >
        <h2 className='text-xl font-semibold mb-4'> Personalized Recommendations</h2>
        <div className='space-y-4'>
          <motion.div whileHover={{ x: 5 }} className='glass p-4 rounded-xl flex items-start gap-3'>
            <div className='w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 '>
              <span className="text-green-400 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Take breaks between 2-4 PM</h3>
              <p className="text-sm text-slate-400 mt-1">You tend to slouch most during this time. Set a timer for every 30 minutes.</p>
            </div>
          </motion.div>
          <motion.div whileHover={{ x: 5 }} className="glass p-4 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Adjust your monitor height</h3>
              <p className="text-sm text-slate-400 mt-1">Forward lean is your most common issue. Your screen might be too low.</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ x: 5 }} className="glass p-4 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-purple-400 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Weekend warrior trend</h3>
              <p className="text-sm text-slate-400 mt-1">Your posture improves on weekends. Try to replicate your weekend setup during weekdays.</p>
            </div>
          </motion.div>
        </div>
          </GlassCard >
      </div>



  )
}

