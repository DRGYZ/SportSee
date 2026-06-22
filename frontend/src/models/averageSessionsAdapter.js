/**
 * Normalize average sessions payload for UI consumption.
 * @param {object} rawAverageSessions
 * @returns {{ userId: number, sessions: Array<{ day: number, sessionLength: number }> }}
 */
export function adaptUserAverageSessions(rawAverageSessions) {
  const source = rawAverageSessions ?? {};
  const sessions = Array.isArray(source.sessions) ? source.sessions : [];

  return {
    userId: Number(source.userId ?? 0),
    sessions: sessions.map((session) => ({
      day: Number(session?.day ?? 0),
      sessionLength: Number(session?.sessionLength ?? 0),
    })),
  };
}
