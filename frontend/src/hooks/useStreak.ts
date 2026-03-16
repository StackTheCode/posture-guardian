import { useQuery } from "@tanstack/react-query"
import { analyticsApi, type StreakResponse } from "../services/api"


export const useStreak = () =>{
     return useQuery<StreakResponse>({
        queryKey: ['streak'],
        queryFn: analyticsApi.getStreak,
        refetchInterval: 60000, 
    });
}