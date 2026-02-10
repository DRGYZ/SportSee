/**
 * Normalize activity endpoint payload for UI consumption.
 * @param {object} rawActivity
 * @returns {{ userId: number, sessions: Array<{ day: string, kilogram: number, calories: number }> }}
 */
export function adaptUserActivity(rawActivity) {
  const activity = rawActivity ?? {};
  const sessions = Array.isArray(activity.sessions) ? activity.sessions : [];

  return {
    userId: Number(activity.userId ?? 0),
    sessions: sessions.map((session) => ({
      day: String(session?.day ?? ""),
      kilogram: Number(session?.kilogram ?? 0),
      calories: Number(session?.calories ?? 0),
    })),
  };
}
