import { useState } from "react";
import { PostureState } from "../types";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { PostureIndicator } from "../components/dashboard/PostureIndicator";
import { StatsCards } from "../components/dashboard/StatsCards";
import { PostureTimeline } from "../components/dashboard/PostureTimeline";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export const DashboardPage = () => {
  const navigate = useNavigate();


  const timelineData = [
    { time: '9:00', severity: 0.2, state: 'good' },
    { time: '10:00', severity: 0.3, state: 'forward_lean' },
    { time: '11:00', severity: 0.15, state: 'good' },
    { time: '12:00', severity: 0.5, state: 'slouched' },
    { time: '13:00', severity: 0.25, state: 'forward_lean' },
    { time: '14:00', severity: 0.7, state: 'slouched' },
    { time: '15:00', severity: 0.4, state: 'shoulder_tilt' },
    { time: '16:00', severity: 0.2, state: 'good' },
  ];

  // mock data
  const [currentPosture] = useState(PostureState.GOOD);
  const [confidence] = useState(0.85);
  const [severity] = useState(0.2);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-10">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">Monitor your posture in real-time</p>
      </motion.div>
      <button
        onClick={() => navigate('/analytics')}
        className="glass px-6 py-3 rounded-xl cursor-pointer hover:glass-strong transition-all flex items-center gap-2"
      >
        <BarChart3 className="w-5 h-5" />
        View Analytics
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Posture Indicator */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="flex flex-col items-center py-4">
            <h2 className="text-xl text-center font-semibold mb-6">Current Posture</h2>
            <PostureIndicator
              state={currentPosture}
              confidence={confidence}
              severity={severity}
            />
            </div>
          </GlassCard>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="glass p-4 rounded-xl"
              >
                <p className="text-slate-300">✓ Take a 5-minute break every hour</p>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="glass p-4 rounded-xl"
              >
                <p className="text-slate-300">✓ Adjust your screen to eye level</p>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="glass p-4 rounded-xl"
              >
                <p className="text-slate-300">✓ Keep your feet flat on the floor</p>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Stats */}
      <StatsCards
        goodPostureCount={45}
        badPostureCount={12}
        averageSeverity={0.35}
        totalEvents={57}
      />

      {/* Timeline placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <PostureTimeline data={timelineData} />
      </motion.div>
    </div>
  )
}