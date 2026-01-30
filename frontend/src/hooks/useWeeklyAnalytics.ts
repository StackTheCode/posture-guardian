import { useEffect, useState } from "react";
import axios from "axios";


interface DailyStats {
  day: string;
  good: number;
  bad: number;
  goodPercentage: number;
}
interface PostureDistribution {
  name: string;
  value: number;
  color: string;
}

interface WeeklyAnalytics {
  totalEvents: number;
  goodPostureCount: number;
  badPostureCount: number;
  averageSeverity: number;
  goodPosturePercentage: number;
  postureDistribution: PostureDistribution[];
  weeklyData: DailyStats[];
  insights: string[];
}

const POSTURE_COLORS: Record<string, string> = {
  good: '#10b981',
  forward_lean: '#f59e0b',
  slouched: '#ef4444',
  shoulder_tilt: '#8b5cf6',
  twisted_spine: '#ec4899',
};
export const useWeeklyAnalytics = () => {
  const [analytics, setAnalytics] = useState<WeeklyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8080/api/v1/analytics/weekly", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;

        const postureDistribution: PostureDistribution[] = Object.entries(
          data.postureDistribution as Record<string, number>
        ).map(([name, value]) => ({
          name: name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          value: value as number,
          color: POSTURE_COLORS[name] || '#6b7280',
        }));
        setAnalytics({
          ...data,
          postureDistribution
        })
        setError(null)
      } catch (error) {
        console.error("Failed to fetch analytics: ", error);
         setError(
    error instanceof Error ? error.message : "Failed to fetch analytics"
  );
      }
      finally {
        setLoading(false);
      }
    }
    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 5 * 60 *1000);
    return () => clearInterval(interval);

  },[]);
  return {analytics,loading,error};
}