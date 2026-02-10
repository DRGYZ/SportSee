import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const httpClient = axios.create({
  baseURL: BASE_URL,
});

/**
 * Perform a GET request and return response payload.
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function get(path) {
  try {
    const response = await httpClient.get(path);
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const serverMessage =
      typeof error?.response?.data === "string"
        ? error.response.data
        : error?.response?.data?.message;
    const details = serverMessage ?? statusText ?? error?.message ?? "Unknown request error";
    const prefix = status ? `HTTP ${status}` : "HTTP request failed";
    throw new Error(`${prefix}: ${details}`);
  }
}
