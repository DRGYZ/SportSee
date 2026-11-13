import * as apiService from "./api/sportseeApi.js";
import { mockService } from "./mock/mockService.js";
import { adaptUserMainData } from "../models/userAdapter.js";
import { adaptUserActivity } from "../models/activityAdapter.js";
import { adaptUserAverageSessions } from "../models/averageSessionsAdapter.js";
import { adaptUserPerformance } from "../models/performanceAdapter.js";

const source = import.meta.env.VITE_DATA_SOURCE === "api" ? apiService : mockService;

export async function loadDashboard(userId, signal) {
  const [user, activity, averageSessions, performance] = await Promise.all([
    source.getUserMainData(userId, signal),
    source.getUserActivity(userId, signal),
    source.getUserAverageSessions(userId, signal),
    source.getUserPerformance(userId, signal),
  ]);

  return {
    user: adaptUserMainData(user.data),
    activity: adaptUserActivity(activity.data),
    averageSessions: adaptUserAverageSessions(averageSessions.data),
    performance: adaptUserPerformance(performance.data),
  };
}
