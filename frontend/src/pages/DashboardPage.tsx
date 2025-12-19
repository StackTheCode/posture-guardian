import { useState } from "react";
import { PostureState } from "../types";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { PostureIndicator } from "../components/dashboard/PostureIndicator";
import { StatsCards } from "../components/dashboard/StatsCards";

export const DashboardPage = () => {

    // mock data
    const [currentPosture] = useState(PostureState.GOOD);
    const [confidence] = useState(0.85);
    const [severity] = useState(0.2);

    return(
        <div>
          {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">Monitor your posture in real-time</p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Posture Indicator */}
        <div className="lg:col-span-1">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6">Current Posture</h2>
            <PostureIndicator 
              state={currentPosture}
              confidence={confidence}
              severity={severity}
            />
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
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">Today's Timeline</h2>
          <div className="h-64 flex items-center justify-center text-slate-400">
            Chart will go here (Recharts implementation)
          </div>
        </GlassCard>
      </motion.div>
      </div>
    )
}