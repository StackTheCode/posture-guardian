
import { beforeEach, describe, vi, it, expect } from "vitest";
import { settingsApi } from "../../services/api";
import { renderHook, waitFor } from "@testing-library/react";
import { useSettings } from "../../hooks/useSettings";
import toast from "react-hot-toast";

vi.mock("../../services/api");
vi.mock("react-hot-toast");

describe("useSettings", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    });

    it("should load settings on mount", async () => {
        const mockSettings = {
            captureIntervalSeconds: 30,
            notificationsEnabled: true,
            notificationSensitivity: "medium" as const,
            workingHoursEnabled: false,
            workingHoursStart: "09:00:00",
            workingHoursEnd: "17:00:00",
            cameraIndex: 0,
            theme: 'dark' as const,
        };
        vi.mocked(settingsApi.getSettings).mockResolvedValue({
            data: mockSettings,
        } as any);

        const { result } = renderHook(() => useSettings())

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.settings).toEqual(mockSettings);
    })

    it("should handle settings load error", async () => {
        vi.mocked(settingsApi.getSettings).mockRejectedValue(
            new Error("Network error")
        )
        const { result } = renderHook(() => useSettings())
        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
        expect(result.current.settings).toBeNull()
        expect(toast.error).toHaveBeenCalled()
    })


    it("should update settings successfully", async () => {
        const mockSettings = {
            captureIntervalSeconds: 30,
            notificationsEnabled: true,
            notificationSensitivity: "medium" as const,
            workingHoursEnabled: false,
            workingHoursStart: "09:00:00",
            workingHoursEnd: "17:00:00",
            cameraIndex: 0,
            theme: "dark" as const,
        };

        vi.mocked(settingsApi.getSettings).mockResolvedValue({
            data: mockSettings,
        } as any);

        const updatedSettings = {
            ...mockSettings,
            captureIntervalSeconds: 15,
        };

        vi.mocked(settingsApi.updateSettings).mockResolvedValue({
            data: updatedSettings,
        } as any);

        const { result } = renderHook(() => useSettings());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        const success = await result.current.updateSettings({
            captureIntervalSeconds: 15,
        });

        expect(success).toBe(true);

        await waitFor(() => {
            expect(result.current.settings?.captureIntervalSeconds).toBe(15);
        });

        expect(toast.success).toHaveBeenCalledWith(
            "Settings saved successfully"
        );
    })

    it("should handle update error", async () => {
        const mockSettings = {
            captureIntervalSeconds: 30,
            notificationsEnabled: true,
            notificationSensitivity: "medium" as const,
            workingHoursEnabled: false,
            workingHoursStart: "09:00:00",
            workingHoursEnd: "17:00:00",
            cameraIndex: 0,
            theme: "dark" as const,
        }
        vi.mocked(settingsApi.getSettings).mockResolvedValue({
            data: mockSettings,
        } as any);


        vi.mocked(settingsApi.updateSettings).mockRejectedValue(
            new Error("Failed to update setting")
        )

        const { result } = renderHook(() => useSettings())
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        })

        const success = await result.current.updateSettings({
            captureIntervalSeconds: 15,
        });

        expect(success).toBe(false);
        expect(toast.error).toHaveBeenCalled();
    })
})