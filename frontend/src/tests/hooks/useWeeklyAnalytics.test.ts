import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, vi,it,expect } from "vitest";
import { useWeeklyAnalytics } from "../../hooks/useWeeklyAnalytics";

vi.mock("axios")


describe("useWeeklyAnalytics",() =>{
    beforeEach(() =>{
        vi.clearAllMocks();
        localStorage.setItem("token","fake-token");
    })
    it("should load analytics on mount",async () =>{
        const mockData = {
            totalEvents:100,
            goodPostureCount:70,
            badPostureCount:30,
            averageSeverity:0.35,
            goodPosturePercentage:70,
            postureDistribution:{
                good:70,
                forward_lean:20,
                slouched:10
            },
            weeklyData:[
             { day: 'Mon', good: 10, bad: 5, goodPercentage: 66.67 },
             { day: 'Tue', good: 12, bad: 3, goodPercentage: 80 },
            ],
            insights:["Great posture this week!"]
        }
        vi.mocked(axios.get).mockResolvedValue({data:mockData});
        const {result} = renderHook(() => useWeeklyAnalytics());

        expect(result.current.loading).toBe(true);

        await waitFor(() =>{
            expect(result.current.loading).toBe(false);
        })

        expect(result.current.analytics).toBeTruthy();
        expect(result.current.analytics?.totalEvents).toBe(100)
        expect(result.current.analytics?.postureDistribution).toHaveLength(3);
    });


      it('should handle analytics load error', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useWeeklyAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.analytics).toBeNull();
    expect(result.current.error).toBeTruthy();
  });
  it("should transform posture distribution correctly",async () =>{
    const mockData = {
         totalEvents: 50,
      goodPostureCount: 30,
      badPostureCount: 20,
      averageSeverity: 0.4,
      goodPosturePercentage: 60,
      postureDistribution: {
        good: 30,
        forward_lean: 15,
        slouched: 5,
      },
      weeklyData: [],
      insights: [],
    };
    vi.mocked(axios.get).mockResolvedValue({data: mockData});

    const {result} = renderHook(() => useWeeklyAnalytics());

    await waitFor(() =>{
        expect(result.current.loading).toBe(false);
    })
    
    const distribution = result.current.analytics?.postureDistribution;
    expect(distribution).toBeTruthy();
    expect(distribution?.[0].name).toBe("Good");
    expect(distribution?.[1].name).toBe("Forward Lean");
    expect(distribution?.[0].value).toBe(30)
  })
})