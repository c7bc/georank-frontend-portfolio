const trackingPixels = {
  signup: process.env.NEXT_PUBLIC_SIGNUP_TRACKING_PIXEL,
  contact: process.env.NEXT_PUBLIC_CONTACT_TRACKING_PIXEL,
  pricing: process.env.NEXT_PUBLIC_PRICING_TRACKING_PIXEL,
};

export type TrackingEvent = keyof typeof trackingPixels;

export function fireTrackingPixel(event: TrackingEvent) {
  const url = trackingPixels[event];
  if (url) new Image().src = url;
}
