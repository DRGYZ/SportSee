import {
  getUserActivity as getUserActivityMock,
  getUserAverageSessions as getUserAverageSessionsMock,
  getUserMainData as getUserMainDataMock,
  getUserPerformance as getUserPerformanceMock,
} from "./mock/mockService";

import {
  getUserActivity as getUserActivityApi,
  getUserAverageSessions as getUserAverageSessionsApi,
  getUserMainData as getUserMainDataApi,
  getUserPerformance as getUserPerformanceApi,
} from "./api/sportseeApi";
import { adaptUserMainData } from "../models/userAdapter";
import { adaptUserActivity } from "../models/activityAdapter";
import { adaptUserAverageSessions } from "../models/averageSessionsAdapter";
import { adaptUserPerformance } from "../models/performanceAdapter";

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE ?? "mock";
const useApi = DATA_SOURCE === "api";

/**
 * Get normalized main user data.
 * @param {string|number} userId
 */
export function getUserMainData(userId) {
  if (!useApi) {
    return getUserMainDataMock(userId);
  }

  return getUserMainDataApi(userId).then((payload) => adaptUserMainData(payload?.data));
}

/**
 * Get normalized user activity data.
 * @param {string|number} userId
 */
export function getUserActivity(userId) {
  if (!useApi) {
    return getUserActivityMock(userId);
  }

  return getUserActivityApi(userId).then((payload) => adaptUserActivity(payload?.data));
}

/**
 * Get normalized average sessions data.
 * @param {string|number} userId
 */
export function getUserAverageSessions(userId) {
  if (!useApi) {
    return getUserAverageSessionsMock(userId);
  }

  return getUserAverageSessionsApi(userId).then((payload) => adaptUserAverageSessions(payload?.data));
}

/**
 * Get normalized performance data with French categories.
 * @param {string|number} userId
 */
export function getUserPerformance(userId) {
  if (!useApi) {
    return getUserPerformanceMock(userId);
  }

  return getUserPerformanceApi(userId).then((payload) => adaptUserPerformance(payload?.data));
}
