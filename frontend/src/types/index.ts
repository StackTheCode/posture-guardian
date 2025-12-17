export interface User {
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface PostureEvent {
  id?: number;
  postureState: PostureState;
  confidence: number;
  severity: number;
  timestamp: string;
}

// Changed from enum to const object
export const PostureState = {
  GOOD: 'good',
  FORWARD_LEAN: 'forward_lean',
  SLOUCHED: 'slouched',
  SHOULDER_TILT: 'shoulder_tilt',
  TWISTED_SPINE: 'twisted_spine',
} as const;

export type PostureState = typeof PostureState[keyof typeof PostureState];

export interface AnalyticsData {
  totalEvents: number;
  postureDistribution: Record<string, number>;
  averageSeverity: number;
  mostCommonPosture: string;
  goodPostureCount: number;
  badPostureCount: number;
}