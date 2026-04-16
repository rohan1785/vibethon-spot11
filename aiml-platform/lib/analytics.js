export function trackEvent(eventName, payload = {}) {
  const stamp = new Date().toISOString();
  console.log(`[analytics] ${eventName}`, { stamp, ...payload });
}
