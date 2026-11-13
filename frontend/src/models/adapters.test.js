import assert from "node:assert/strict";
import { test } from "node:test";
import fixtures from "../services/mock/demoData.json" with { type: "json" };
import { adaptUserMainData } from "./userAdapter.js";
import { adaptUserActivity } from "./activityAdapter.js";
import { adaptUserAverageSessions } from "./averageSessionsAdapter.js";
import { adaptUserPerformance } from "./performanceAdapter.js";

test("normalizes both score fields used by the demo profiles", () => {
  const [karl, cecilia] = fixtures.users.map(adaptUserMainData);
  assert.equal(karl.score, 0.12);
  assert.equal(cecilia.score, 0.3);
  assert.equal(cecilia.keyData.calorieCount, 2500);
  assert.equal(adaptUserMainData({ todayScore: 0, score: 0.3 }).score, 0);
  assert.equal(adaptUserMainData({ score: 1.3 }).score, 1);
});

test("activity preserves dates while converting numeric strings", () => {
  assert.deepEqual(adaptUserActivity({
    userId: "12",
    sessions: [{ day: "2020-07-01", kilogram: "80", calories: "240" }],
  }), {
    userId: 12,
    sessions: [{ day: "2020-07-01", kilogram: 80, calories: 240 }],
  });
});

test("average sessions use weekday numbers and preserve zero minutes", () => {
  assert.deepEqual(adaptUserAverageSessions({
    userId: "18",
    sessions: [{ day: "1", sessionLength: "0" }, { day: "2", sessionLength: "35" }],
  }).sessions, [{ day: 1, sessionLength: 0 }, { day: 2, sessionLength: 35 }]);
});

test("performance labels follow the API's category map and are translated", () => {
  assert.deepEqual(adaptUserPerformance({
    userId: 12,
    kind: { 2: "energy", 4: "strength", 8: "balance" },
    data: [{ kind: 4, value: "70" }, { kind: 2, value: 25 }, { kind: 8, value: 42 }],
  }).categories, [
    { labelFr: "Force", value: 70 },
    { labelFr: "Énergie", value: 25 },
    { labelFr: "balance", value: 42 },
  ]);
});
