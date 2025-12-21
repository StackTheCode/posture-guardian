import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { GlassCard } from '../ui/GlassCard';

interface TimelineDataPoint {
  time: string;
  severity: number;
  state: string
}


interface PostureTimelineProps {
  data: TimelineDataPoint[];
}

export const PostureTimeline = ({ data }: PostureTimelineProps) => {
  const CustomToolTip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;


    return (
      <div className="glass-strong p-3 rounded-xl">
        <p className="text-sm text-slate-300">{payload[0].payload.time}</p>
        <p className="text-sm font-semibold text-purple-400">
          Severity: {(payload[0].value * 100).toFixed(0)}%
        </p>
        <p className="text-xs text-slate-400 capitalize">
          {payload[0].payload.state.replace('_', ' ')}
        </p>
      </div>
    );
  };
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Today's Timeline</h2>
          <p className="text-sm text-slate-400 mt-1">Posture severity throughout the day</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-400">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-400">Poor</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data} >
          <defs>
            <linearGradient id="severityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
         <YAxis 
            stroke="#94a3b8" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomToolTip />} />
          <Area 
            type="monotone" 
            dataKey="severity" 
            stroke="#a855f7" 
            strokeWidth={2}
            fill="url(#severityGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>

    </GlassCard>
  )
}

