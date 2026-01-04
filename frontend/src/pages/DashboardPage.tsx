
import { PostureState } from "../types";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { PostureIndicator } from "../components/dashboard/PostureIndicator";
import { StatsCards } from "../components/dashboard/StatsCards";
import { PostureTimeline } from "../components/dashboard/PostureTimeline";
import { useNavigate } from "react-router-dom";
import { BarChart3, LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { usePostureWebSocket } from "../hooks/usePostureWebSocket";
import { usePostureAnalytics } from "../hooks/usePostureAnalytics";


export const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, username, token } = useAuthStore();

  // Real time posture Indicator update
  const { postureData, isConnected } = usePostureWebSocket(username!, token!);

// Anallytics data  for stats and timeline
  const {analytics,loading} = usePostureAnalytics();



  const handleLogout =  () => {
    logout();
    navigate('/login');
  }



  const currentPosture = postureData?.postureState || PostureState.GOOD;
  const confidence = postureData?.confidence || 0.85;
  const severity = postureData?.severity || 0.2;



  return (
    <div className="min-h-screen p-6 flex flex-col gap-10">
      {/* Header with Logout */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {username}  Monitor your posture in real-time
            </p>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Live</span>

                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">Offline</span>

                </>
              )
              }
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="glass px-6 py-3 cursor-pointer rounded-xl hover:glass-strong transition-all flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/analytics')}
          className="glass px-6 py-3 rounded-xl cursor-pointer hover:glass-strong transition-all flex items-center gap-2"
        >
          <BarChart3 className="w-5 h-5" />
          View Analytics
        </button>
      </div>

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

      {loading ? (
        <div className="text-center text-slate-400">Loading analytics...</div>
      ): (
         <StatsCards
        goodPostureCount={analytics.goodPostureCount}
        badPostureCount={analytics.badPostureCount}
        averageSeverity={analytics.averageSeverity}
        totalEvents={analytics.totalEvents}
      />
      )
      }
     

      {/* Timeline with real data  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        {analytics.timelineData.length > 0 ? (
  <PostureTimeline data={analytics.timelineData} />
        ) :(
          <GlassCard >
            <div className="text-center py-8n text-slate-400">
              <p className="text-sm mt-2">No popsture data yet today</p>
              <p>P.S start your desktop application to begin tracking</p>
            </div>
          </GlassCard>
        )  
        
      }
      
      </motion.div>
    </div>
  )
}