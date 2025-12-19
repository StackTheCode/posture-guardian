import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface StatsCardsProps{
    goodPostureCount:number;
    badPostureCount: number;
  averageSeverity: number;
  totalEvents: number;
}


export const StatsCards = ({goodPostureCount,badPostureCount,averageSeverity,totalEvents}:StatsCardsProps) => {
 const stats = [
    {
      label: 'Good Posture',
      value: goodPostureCount,
      icon: TrendingUp,
      color: 'text-green-400',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Needs Work',
      value: badPostureCount,
      icon: TrendingDown,
      color: 'text-red-400',
      gradient: 'from-red-500/20 to-pink-500/20',
    },
    {
      label: 'Avg Severity',
      value: `${(averageSeverity * 100).toFixed(0)}%`,
      icon: Activity,
      color: 'text-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      label: 'Total Events',
      value: totalEvents,
      icon: Clock,
      color: 'text-purple-400',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <GlassCard className={`bg-gradient-to-br ${stat.gradient}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </GlassCard>
      </motion.div>
    ))}
  </div>
  )
}
