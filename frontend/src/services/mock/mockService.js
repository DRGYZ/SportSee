import {
  mockActivityData,
  mockAverageSessionsData,
  mockMainData,
  mockPerformanceData,
} from "./mockData";

import { adaptUserMainData } from "../../models/userAdapter";
import { adaptUserActivity } from "../../models/activityAdapter";
import { adaptUserAverageSessions } from "../../models/averageSessionsAdapter";
import { adaptUserPerformance } from "../../models/performanceAdapter";

function parseUserId(userId) {
  return Number(userId);
}

function getMockPayloadOrThrow(dataset, userId, endpoint) {
  const parsedUserId = parseUserId(userId);
  const payload = dataset[parsedUserId];

  if (!payload) {
    throw new Error(`No mock data for user ${parsedUserId} on endpoint ${endpoint}`);
  }

  return payload.data ?? {};
}

/**
 * @param {string|number} userId
 */
export async function getUserMainData(userId) {
  return adaptUserMainData(getMockPayloadOrThrow(mockMainData, userId, "/user/:id"));
}

/**
 * @param {string|number} userId
 */
export async function getUserActivity(userId) {
  return adaptUserActivity(getMockPayloadOrThrow(mockActivityData, userId, "/user/:id/activity"));
}

/**
 * @param {string|number} userId
 */
export async function getUserAverageSessions(userId) {
  return adaptUserAverageSessions(
    getMockPayloadOrThrow(mockAverageSessionsData, userId, "/user/:id/average-sessions")
  );
}

/**
 * @param {string|number} userId
 */
export async function getUserPerformance(userId) {
  return adaptUserPerformance(
    getMockPayloadOrThrow(mockPerformanceData, userId, "/user/:id/performance")
  );
}
