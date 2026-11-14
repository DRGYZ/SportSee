import assert from "node:assert/strict";
import { test } from "node:test";
import fixtures from "../services/mock/demoData.json" with { type: "json" };
import { adaptUserMainData } from "./userAdapter.js";
import { adaptUserActivity } from "./activityAdapter.js";
import { adaptUserAverageSessions } from "./averageSessionsAdapter.js";
import { adaptUserPerformance } from "./performanceAdapter.js";
import {
  computeDashboardInsights,
  computeMacroShares,
  computeProfileDelta,
  formatInt,
} from "./dashboardInsights.js";

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

test("computes weekly synthesis insights, macro shares, and profile deltas from demo profiles", () => {
  const buildDashboard = (index) => ({
    user: adaptUserMainData(fixtures.users[index]),
    activity: adaptUserActivity(fixtures.activity[index]),
    averageSessions: adaptUserAverageSessions(fixtures.averageSessions[index]),
    performance: adaptUserPerformance(fixtures.performance[index]),
  });

  const karl = buildDashboard(0);
  const cecilia = buildDashboard(1);

  const karlInsights = computeDashboardInsights(karl);
  assert.equal(karlInsights.weightDeltaFormatted, "-4 kg");
  assert.equal(karlInsights.burnTotal, 1742);
  assert.equal(karlInsights.sessionTotal, 208);
  assert.equal(karlInsights.activeDaysCount, 5);
  assert.equal(karlInsights.scorePercent, 12);
  assert.equal(karlInsights.radarTopLabel, "Pic : Vitesse 200");
  assert.deepEqual(computeMacroShares(karl.user.keyData), {
    proteinShare: 28,
    carbShare: 52,
    lipidShare: 20,
    calorieBarPercent: 69,
  });

  const ceciliaInsights = computeDashboardInsights(cecilia);
  assert.equal(ceciliaInsights.weightDeltaFormatted, "-1 kg");
  assert.equal(ceciliaInsights.burnTotal, 1952);
  assert.equal(ceciliaInsights.sessionTotal, 280);
  assert.equal(ceciliaInsights.activeDaysCount, 7);
  assert.equal(ceciliaInsights.scorePercent, 30);
  assert.equal(ceciliaInsights.peakBurnCalories, 500);
  assert.equal(ceciliaInsights.peakBurnIndex, 3);
  assert.equal(ceciliaInsights.radarMean, 155);

  const delta = computeProfileDelta(karl, cecilia);
  assert.equal(delta.fromLabel, "Karl (#12)");
  assert.equal(delta.toLabel, "Cecilia (#18)");
  assert.equal(delta.scoreChip, "Objectif +18 pts (12% → 30%)");
  assert.equal(delta.volumeChip, "Volume +72 min (208 → 280 min)");
  assert.equal(delta.burnRadarChip, "Burn +210 kCal · Radar +42 pts");
  assert.equal(computeProfileDelta(karl, karl), null);

  const reverseDelta = computeProfileDelta(cecilia, karl);
  assert.equal(reverseDelta.scoreChip, "Objectif -18 pts (30% → 12%)");
  assert.equal(reverseDelta.volumeChip, "Volume -72 min (280 → 208 min)");
  assert.equal(reverseDelta.burnRadarChip, "Burn -210 kCal · Radar -42 pts");

  assert.equal(formatInt(0), "0");
  assert.equal(formatInt(1930), "1\u00A0930");
  assert.deepEqual(computeMacroShares({}), {
    proteinShare: 0,
    carbShare: 0,
    lipidShare: 0,
    calorieBarPercent: 0,
  });

  const emptyInsights = computeDashboardInsights({});
  assert.equal(emptyInsights.burnTotal, 0);
  assert.equal(emptyInsights.sessionTotal, 0);
  assert.equal(emptyInsights.scorePercent, 0);
});
