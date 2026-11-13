import { get } from "./http.js";

function userPath(userId) {
  return `/user/${encodeURIComponent(userId)}`;
}

export function getUserMainData(userId, signal) {
  return get(userPath(userId), signal);
}

export function getUserActivity(userId, signal) {
  return get(`${userPath(userId)}/activity`, signal);
}

export function getUserAverageSessions(userId, signal) {
  return get(`${userPath(userId)}/average-sessions`, signal);
}

export function getUserPerformance(userId, signal) {
  return get(`${userPath(userId)}/performance`, signal);
}
