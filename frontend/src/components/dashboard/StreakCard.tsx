import { motion } from 'framer-motion'
import { Flame, Trophy } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak'
import { GlassCard } from '../ui/GlassCard';

const StreakCard = () => {
    const { data: streak ,isLoading} = useStreak();

    if (isLoading) {
        return (
            <GlassCard>
                <div className='p-6 animate-pulse'>
                </div>
            </GlassCard>
        )
    }


    if (!streak) return null;


    return (
        <GlassCard className='relative overflow-hidden h-full flex flex-col justify-between'>
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-red-500/10"></div>
            <div className="relative p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-300">Streak</h3>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                </div>

                <div className='flex items-center gap-4'>
                    <div className='flex-1'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className='text-5xl font-bold flex items-center gap-2'>
                            <Flame className={`w-12 h-12 ${streak.currentStreak > 0 ?
                                "text-orange-400" :
                                "text-slate-600"
                                }`} />
                            <span className={
                                streak.currentStreak > 0 ?
                                    "bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
                                    : "text-slate-600"
                            }>
                                {streak.currentStreak}
                            </span>
                        </motion.div>
                        <p className='text-sm text-slate-400 mt-2'>
                            {
                                streak.currentStreak === 0 ?
                                    "Start your streak today" :
                                    streak.currentStreak === 1 ?
                                        "Day of good posture"
                                        : "Days of good posture"
                            }
                        </p>
                    </div>

                    {/* Best Streak */}
                    {streak.longestStreak > 0 && (
                        <div className='text-right'>
                            <div className='text-2xl font-bold text-slate-300'>
                                {streak.longestStreak}
                            </div>
                            <div className='text-xs text-slate-500'>
                                Best Streak
                            </div>
                        </div>
                    )}
                </div>

                {/* Motivational Message */}

              {streak.currentStreak >=7 && (
                <motion.div initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                className="mt-4 px-3 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <p className='text-sm text-orange-300'>
                Amazing! {streak.currentStreak} days streak!
              </p>
                </motion.div>
              )}
            </div>
        </GlassCard>
    )

}

export default StreakCard