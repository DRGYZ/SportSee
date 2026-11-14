export const DAY_SHORT_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
export const DAY_FULL_LABELS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
export const PERFORMANCE_DISPLAY_ORDER = [
  "Intensité",
  "Vitesse",
  "Force",
  "Endurance",
  "Énergie",
  "Cardio",
];

function normalizeOrderKey(label) {
  return String(label ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const ORDER_MAP = PERFORMANCE_DISPLAY_ORDER.reduce((acc, label, index) => {
  acc[normalizeOrderKey(label)] = index;
  return acc;
}, {});

/**
 * Sort performance categories using SportSee's canonical 6-axis order.
 * @param {Array<{ labelFr?: string, value?: number }>} categories
 * @returns {Array<{ labelFr: string, value: number }>}
 */
export function sortPerformanceCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  return safeCategories
    .map((item) => ({
      labelFr: String(item?.labelFr ?? ""),
      value: Number(item?.value ?? 0),
    }))
    .sort((leftItem, rightItem) => {
      const leftOrder = ORDER_MAP[normalizeOrderKey(leftItem.labelFr)] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = ORDER_MAP[normalizeOrderKey(rightItem.labelFr)] ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
}

/**
 * Format a numeric value using a non-breaking space thousands separator.
 * @param {number} value
 * @returns {string}
 */
export function formatInt(value) {
  const numeric = Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0;
  return numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

/**
 * Derive P/G/L caloric shares (4/4/9 kcal/g) and daily calorie gauge percentage.
 * @param {{ calorieCount?: number, proteinCount?: number, carbohydrateCount?: number, lipidCount?: number }} keyData
 * @returns {{ proteinShare: number, carbShare: number, lipidShare: number, calorieBarPercent: number }}
 */
export function computeMacroShares(keyData = {}) {
  const calorieCount = Number(keyData.calorieCount ?? 0);
  const proteinCount = Number(keyData.proteinCount ?? 0);
  const carbohydrateCount = Number(keyData.carbohydrateCount ?? 0);
  const lipidCount = Number(keyData.lipidCount ?? 0);

  const pKcal = Math.max(0, proteinCount) * 4;
  const cKcal = Math.max(0, carbohydrateCount) * 4;
  const lKcal = Math.max(0, lipidCount) * 9;
  const totalMacroKcal = pKcal + cKcal + lKcal;
  const calorieBarPercent =
    calorieCount > 0 ? Math.max(12, Math.min(100, Math.round((calorieCount / 2800) * 100))) : 0;

  if (totalMacroKcal === 0) {
    return {
      proteinShare: 0,
      carbShare: 0,
      lipidShare: 0,
      calorieBarPercent,
    };
  }

  const proteinShare = Math.round((pKcal / totalMacroKcal) * 100);
  const carbShare = Math.round((cKcal / totalMacroKcal) * 100);
  const lipidShare = Math.max(0, 100 - proteinShare - carbShare);

  return {
    proteinShare,
    carbShare,
    lipidShare,
    calorieBarPercent,
  };
}

/**
 * Compute weekly synthesis metrics, chart takeaways, and default scrub target.
 * @param {{ user?: object, activity?: { sessions?: Array }, averageSessions?: { sessions?: Array }, performance?: { categories?: Array } }} dashboard
 */
export function computeDashboardInsights(dashboard) {
  const user = dashboard?.user ?? {};
  const activitySessions = Array.isArray(dashboard?.activity?.sessions)
    ? dashboard.activity.sessions
    : [];
  const avgSessions = Array.isArray(dashboard?.averageSessions?.sessions)
    ? dashboard.averageSessions.sessions
    : [];
  const perfCategories = Array.isArray(dashboard?.performance?.categories)
    ? dashboard.performance.categories
    : [];

  // Weight & Active Burn (7 days)
  const kilograms = activitySessions.map((s) => Number(s?.kilogram ?? 0));
  const calories = activitySessions.map((s) => Number(s?.calories ?? 0));
  const startKg = kilograms[0] ?? 0;
  const endKg = kilograms[kilograms.length - 1] ?? 0;
  const weightDeltaNum = Number((endKg - startKg).toFixed(1));
  const weightDeltaFormatted =
    weightDeltaNum > 0 ? `+${weightDeltaNum} kg` : `${weightDeltaNum} kg`;
  const weightRange = `${Math.round(startKg)} → ${Math.round(endKg)} kg`;

  const burnTotal = Math.round(calories.reduce((sum, val) => sum + val, 0));
  const burnAverage = activitySessions.length
    ? Math.round(burnTotal / activitySessions.length)
    : 0;

  let peakBurnIndex = calories.length > 0 ? 0 : -1;
  let minBurnIndex = calories.length > 0 ? 0 : -1;
  for (let i = 1; i < calories.length; i += 1) {
    if (calories[i] >= calories[peakBurnIndex]) {
      peakBurnIndex = i;
    }
    if (calories[i] < calories[minBurnIndex]) {
      minBurnIndex = i;
    }
  }

  const peakBurnCalories = peakBurnIndex >= 0 ? Math.round(calories[peakBurnIndex]) : 0;
  const peakBurnDayName =
    peakBurnIndex >= 0
      ? (DAY_FULL_LABELS[peakBurnIndex] ?? `J${peakBurnIndex + 1}`)
      : "—";
  const defaultDayIndex =
    peakBurnIndex >= 0
      ? peakBurnIndex
      : Math.max(0, activitySessions.length - 1);

  const weightExplain =
    activitySessions.length > 0
      ? `Pic de charge à ${peakBurnCalories} kCal (${peakBurnDayName}) et moyenne quotidienne de ${burnAverage} kCal.`
      : "Aucune séance enregistrée sur la semaine.";

  // Session Volume & Rhythm (L–D)
  const lengths = avgSessions.map((s) => Number(s?.sessionLength ?? 0));
  const sessionTotal = Math.round(lengths.reduce((sum, val) => sum + val, 0));
  const activeDaysCount = lengths.filter((val) => val > 0).length;
  const totalDays = lengths.length || 7;
  const restDaysCount = Math.max(0, totalDays - activeDaysCount);
  const activeDaysLabel = `${activeDaysCount} / ${totalDays} j actifs`;
  const activeDaysShort = `${activeDaysCount}/${totalDays} j`;
  const sessionMeanValue =
    activeDaysCount > 0 ? (sessionTotal / activeDaysCount).toFixed(1) : "0.0";
  const sessionMeanLabel = `${sessionMeanValue} min / séance`;

  let peakSessionIndex = lengths.length > 0 ? 0 : -1;
  for (let i = 1; i < lengths.length; i += 1) {
    if (lengths[i] >= lengths[peakSessionIndex]) {
      peakSessionIndex = i;
    }
  }
  const peakSessionLength =
    peakSessionIndex >= 0 ? Math.round(lengths[peakSessionIndex]) : 0;
  const peakSessionDayName =
    peakSessionIndex >= 0 ? (DAY_FULL_LABELS[peakSessionIndex] ?? "Dim.") : "Dim.";

  const sessionExplain =
    avgSessions.length === 0
      ? "Aucune durée moyenne disponible."
      : restDaysCount > 0
        ? `Pause de ${restDaysCount} j (0 min) avant une sortie longue de ${peakSessionLength} min (${peakSessionDayName}).`
        : `Aucune journée de repos (${activeDaysCount}/${totalDays} j actifs) et bloc soutenu à ${peakSessionLength} min (${peakSessionDayName}).`;

  // Goal Progress & Performance Radar
  const clampedScore = Math.max(0, Math.min(1, Number(user.score ?? 0) || 0));
  const scorePercent = Math.round(clampedScore * 100);
  const remainingPercent = Math.max(0, 100 - scorePercent);
  const goalStage =
    scorePercent >= 70
      ? "Objectif proche"
      : scorePercent >= 25
        ? "En progression"
        : "Démarrage";

  const sortedCategories = sortPerformanceCategories(perfCategories);

  const radarMean = sortedCategories.length
    ? Math.round(
        sortedCategories.reduce((sum, cat) => sum + cat.value, 0) /
          sortedCategories.length,
      )
    : 0;

  const topCategory = sortedCategories.reduce(
    (best, cat) => (!best || cat.value > best.value ? cat : best),
    null,
  );
  const lowCategory = sortedCategories.reduce(
    (worst, cat) => (!worst || cat.value < worst.value ? cat : worst),
    null,
  );

  const radarTopLabel = topCategory
    ? `Pic : ${topCategory.labelFr} ${Math.round(topCategory.value)}`
    : "—";
  const radarLowLabel = lowCategory
    ? `Creux : ${lowCategory.labelFr} ${Math.round(lowCategory.value)}`
    : "—";
  const goalExplain =
    topCategory && lowCategory
      ? `Dominante ${topCategory.labelFr} (${Math.round(topCategory.value)}) · marge de progression sur ${lowCategory.labelFr} (${Math.round(lowCategory.value)}).`
      : "Complétez vos séances pour situer vos qualités athlétiques.";

  const heroSubtitle = `${activeDaysCount}/${totalDays} jours actifs (${sessionTotal} min), évolution de masse de ${weightDeltaFormatted} (${weightRange}) et pic à ${peakBurnCalories} kCal (${peakBurnDayName}).`;
  const macros = computeMacroShares(user.keyData ?? {});

  return {
    kilograms,
    startKg,
    endKg,
    weightDeltaNum,
    weightDeltaFormatted,
    weightRange,
    burnTotal,
    burnAverage,
    peakBurnIndex,
    minBurnIndex,
    peakBurnCalories,
    peakBurnDayName,
    defaultDayIndex,
    weightExplain,
    sessionTotal,
    activeDaysCount,
    totalDays,
    restDaysCount,
    activeDaysLabel,
    activeDaysShort,
    sessionMeanValue,
    sessionMeanLabel,
    peakSessionIndex,
    peakSessionLength,
    peakSessionDayName,
    sessionExplain,
    scorePercent,
    remainingPercent,
    goalStage,
    radarMean,
    topCategory,
    lowCategory,
    radarTopLabel,
    radarLowLabel,
    goalExplain,
    heroSubtitle,
    macros,
  };
}

function fmtSigned(value, unit) {
  const sign = value > 0 ? "+" : "";
  return unit ? `${sign}${value} ${unit}` : `${sign}${value}`;
}

/**
 * Summarize comparative deltas when switching between two athlete profiles.
 * @param {object|null} previousDashboard
 * @param {object|null} currentDashboard
 */
export function computeProfileDelta(previousDashboard, currentDashboard) {
  if (
    !previousDashboard ||
    !currentDashboard ||
    String(previousDashboard.user?.id ?? "") === String(currentDashboard.user?.id ?? "")
  ) {
    return null;
  }

  const prev = computeDashboardInsights(previousDashboard);
  const curr = computeDashboardInsights(currentDashboard);

  const scoreDiff = curr.scorePercent - prev.scorePercent;
  const sessionDiff = curr.sessionTotal - prev.sessionTotal;
  const burnDiff = curr.burnTotal - prev.burnTotal;
  const radarDiff = curr.radarMean - prev.radarMean;

  const fromLabel = `${previousDashboard.user?.firstName ?? "Athlète"} (#${previousDashboard.user?.id ?? "?"})`;
  const toLabel = `${currentDashboard.user?.firstName ?? "Athlète"} (#${currentDashboard.user?.id ?? "?"})`;

  const scoreChip = `Objectif ${fmtSigned(scoreDiff, "pts")} (${prev.scorePercent}% → ${curr.scorePercent}%)`;
  const volumeChip = `Volume ${fmtSigned(sessionDiff, "min")} (${prev.sessionTotal} → ${curr.sessionTotal} min)`;
  const burnRadarChip = `Burn ${fmtSigned(burnDiff, "kCal")} · Radar ${fmtSigned(radarDiff, "pts")}`;

  const summary = `objectif à ${curr.scorePercent}% (${fmtSigned(scoreDiff, "pts")}), ${curr.activeDaysCount}/${curr.totalDays} jours actifs et pic à ${curr.peakBurnCalories} kCal (${curr.peakBurnDayName}).`;

  return {
    fromLabel,
    toLabel,
    summary,
    scoreChip,
    volumeChip,
    burnRadarChip,
  };
}
