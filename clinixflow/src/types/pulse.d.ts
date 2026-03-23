interface PulseAnalytics {
  track: (event: string, props?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  _id: () => string;
  _send: (data: Record<string, unknown>) => void;
  _uid: string | null;
  _sid: string | null;
  _q: unknown[];
}

interface Window {
  pulse: PulseAnalytics;
}
