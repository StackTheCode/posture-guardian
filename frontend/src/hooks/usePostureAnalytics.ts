import { useEffect, useState } from "react";
import { postureApi } from "../services/api";
import type { PostureEvent } from "../types";

interface AnalyticsData {
    goodPostureCount: number;
    badPostureCount: number;
    averageSeverity: number;
    totalEvents: number;
    timelineData: Array<{ time: string, severity: number; state: string }>;
}
export const usePostureAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        goodPostureCount: 0,
        badPostureCount: 0,
        averageSeverity: 0,
        totalEvents: 0,
        timelineData: [],
    })
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
                const endOfDay = new Date(today.setHours(24, 59, 59, 999)).toISOString();
                const response = await postureApi.getEvents(startOfDay, endOfDay);
                const events: PostureEvent[] = response.data;
                const goodCount = events.filter(e => e.postureState === 'good').length;
                const badCount = events.length - goodCount;
                const avgSeverity = events.length > 0 ? events.reduce((sum, e) => sum + Number(e.severity), 0) / events.length : 0;

                const timeline = events.reduce((acc, event) => {
                    const hour = new Date(event.timestamp).getHours();
                    const timeKey = `${hour}:00`;

                    if (!acc[timeKey]) {
                        acc[timeKey] = { time: timeKey, severity: 0, count: 0, state: event.postureState };
                    }

                    acc[timeKey].severity += Number(event.severity);
                    acc[timeKey].count += 1;

                    return acc;
                }, {} as Record<string, any>);

                const timelineData = Object.values(timeline).map((t: any) => ({
                    time: t.time,
                    severity: t.severity / t.count,
                    state: t.state,
                }));

                setAnalytics({
                    goodPostureCount: goodCount,
                    badPostureCount: badCount,
                    averageSeverity: avgSeverity,
                    totalEvents: events.length,
                    timelineData: timelineData.sort((a, b) => parseInt(a.time) - parseInt(b.time)),
                });

            } catch (error) {
                console.error("failed to fetch analytics :", error)
            } finally{
                setLoading(false);
            }
        };
        fetchAnalytics();

        const interval = setInterval(fetchAnalytics,30000);
        return () => clearInterval(interval);

    },[])

     return { analytics, loading };
}