/**
 * Self-hosted analytics for privacy-first monitoring
 * No user data is sent to external services
 */

type EventData = {
  event: string;
  timestamp: number;
  path: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
};

export class AnalyticsClient {
  private static instance: AnalyticsClient;
  private events: EventData[] = [];
  private readonly maxEvents = 100;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupBeaconOnUnload();
    }
  }

  static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient();
    }
    return AnalyticsClient.instance;
  }

  trackEvent(eventName: string, metadata?: Record<string, unknown>): void {
    const event: EventData = {
      event: eventName,
      timestamp: Date.now(),
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      metadata,
    };

    this.events.push(event);

    if (this.events.length >= this.maxEvents) {
      this.flushEvents();
    }
  }

  private flushEvents(): void {
    if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
      // TODO: send events batch to self-hosted endpoint.
    }
    this.events = [];
  }

  private setupBeaconOnUnload(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => {
        this.flushEvents();
      });
    }
  }
}

export const analytics = AnalyticsClient.getInstance();
