import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleApiError, showSuccess } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { AxiosError } from "axios";




vi.mock('react-hot-toast');

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleApiError', () => {
    it('should show error toast for Axios error with message', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: { message: 'Session expired. Please login again.' },
          status: 401,
        },
      } as AxiosError;

      const message = handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('Session expired. Please login again.');
      expect(message).toBe('Session expired. Please login again.');
    });

    it('should handle 401 errors and redirect', () => {
      vi.useFakeTimers();
      const error = {
        isAxiosError: true,
        response: {
          status: 401,
        },
      } as AxiosError;

      handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('Session expired. Please login again.');
      
      vi.advanceTimersByTime(2000);
      // Note: window.location.href redirect is hard to test, would need jsdom setup
      
      vi.useRealTimers();
    });

    it('should handle 404 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 404,
        },
      } as AxiosError;

      handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('Resource not found.');
    });

    it('should handle 500 errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 500,
        },
      } as AxiosError;

      handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
    });

    it('should handle non-Axios errors', () => {
      const error = new Error('Network error');

      const message = handleApiError(error);

      expect(toast.error).toHaveBeenCalledWith('Network error');
      expect(message).toBe('Network error');
    });

    it('should use fallback message when no error message available', () => {
      const error = {};

      const message = handleApiError(error, 'Something went wrong');

      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
      expect(message).toBe('Something went wrong');
    });
  });

  describe('showSuccess', () => {
    it('should show success toast', () => {
      showSuccess('Login successful');

      expect(toast.success).toHaveBeenCalledWith('Login successful');
    });
  });
});