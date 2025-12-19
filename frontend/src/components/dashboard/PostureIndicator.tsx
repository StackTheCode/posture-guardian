import { div } from "motion/react-client";
import { PostureState } from "../../types"
import { AlertCircle, CheckCircle } from 'lucide-react'
import {motion} from 'framer-motion'
interface PostureIndicatorProps {
    state: PostureState;
    confidence: number;
    severity: number;
}

export const PostureIndicator = ({ state, confidence, severity }: PostureIndicatorProps) => {
    const getStatusConfig = () => {
        if (state === PostureState.GOOD) {
            return {
                color: 'from-green-400 to-emerald-600',
                icon: CheckCircle,
                label: 'Excellent Posture',
                ringColor: 'ring-yellow-500/50'

            };

        } else {
            return {
                color: 'from-red-400 to-pink-600',
                icon: AlertCircle,
                label: 'Needs Attention',
                ringColor: 'ring-red-500/50',
            }
        };
    }
    const config = getStatusConfig()
    const Icon = config.icon;
    return (
         <div className="relative">
    {/* Pulsing rings */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`absolute inset-0 rounded-full ring-4 ${config.ringColor} blur-xl`}
    />
    
    {/* Main indicator */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`relative w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${config.color} 
                  flex flex-col items-center justify-center shadow-2xl`}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className="w-16 h-16 text-white mb-2" />
      </motion.div>
      
      <div className="text-center">
        <p className="text-xl font-bold text-white">{config.label}</p>
        <p className="text-sm text-white/80 mt-1">
          {(confidence * 100).toFixed(0)}% confident
        </p>
      </div>
    </motion.div>

    {/* Severity bar */}
    <div className="mt-6 bg-slate-800/50 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${severity * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full bg-gradient-to-r ${config.color}`}
      />
    </div>
    <p className="text-center text-sm text-slate-400 mt-2">
      Severity: {(severity * 100).toFixed(0)}%
    </p>
  </div>
    )
};
