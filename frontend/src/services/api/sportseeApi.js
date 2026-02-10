import { get } from "./http";

/**
 * @param {string|number} userId
 * @returns {Promise<any>}
 */
export function getUserMainData(userId) {
  return get(`/user/${userId}`);
}

/**
 * @param {string|number} userId
 * @returns {Promise<any>}
 */
export function getUserActivity(userId) {
  return get(`/user/${userId}/activity`);
}

/**
 * @param {string|number} userId
 * @returns {Promise<any>}
 */
export function getUserAverageSessions(userId) {
  return get(`/user/${userId}/average-sessions`);
}

/**
 * @param {string|number} userId
 * @returns {Promise<any>}
 */
export function getUserPerformance(userId) {
  return get(`/user/${userId}/performance`);
}
