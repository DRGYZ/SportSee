const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export async function get(path, signal) {
  const timeout = AbortSignal.timeout(8000);
  const response = await fetch(baseUrl + path, {
    headers: { Accept: "application/json" },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  if (!payload?.data || typeof payload.data !== "object") {
    throw new Error("Réponse SportSee invalide.");
  }

  return payload;
}
