import React, { useCallback, useId, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ActivityChart from "./charts/ActivityChart";
import AverageSessionsChart from "./charts/AverageSessionsChart";
import PerformanceRadar from "./charts/PerformanceRadar";
import ScoreRadial from "./charts/ScoreRadial";
import KeyDataCard from "./ui/KeyDataCard";
import {
  computeDashboardInsights,
  formatInt,
} from "../models/dashboardInsights";

function WeightSparkline({ kilograms }) {
  const gradId = useId();

  if (!Array.isArray(kilograms) || kilograms.length < 2) {
    return null;
  }

  const minVal = Math.min(...kilograms);
  const maxVal = Math.max(...kilograms);
  const span = Math.max(1, maxVal - minVal);
  const width = 84;
  const height = 28;
  const padX = 4;
  const padY = 4;

  const points = kilograms.map((val, idx) => {
    const x = padX + (idx / (kilograms.length - 1)) * (width - padX * 2);
    const y = height - padY - ((val - minVal) / span) * (height - padY * 2);
    return { x, y };
  });

  const polylineStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaStr = `M ${firstPt.x.toFixed(1)},${height} L ${points
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" L ")} L ${lastPt.x.toFixed(1)},${height} Z`;

  return (
    <svg
      className="synth-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F766E" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#0F766E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaStr} fill={`url(#${gradId})`} />
      <polyline
        fill="none"
        stroke="#0F766E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylineStr}
      />
      <circle cx={lastPt.x} cy={lastPt.y} r="3" fill="#0F766E" />
    </svg>
  );
}

WeightSparkline.propTypes = {
  kilograms: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * Presentational Direction A ("Chronomètre & Piste") dashboard layout.
 */
function DashboardSkeleton({
  userId = "12",
  firstName = "Utilisateur",
  age = null,
  activitySessions = [],
  averageSessions = [],
  performanceCategories = [],
  score = 0,
  keyData = {},
  targetInsights = null,
  profileDelta = null,
}) {
  const animatedInsights = useMemo(
    () =>
      computeDashboardInsights({
        user: { score, keyData },
        activity: { sessions: activitySessions },
        averageSessions: { sessions: averageSessions },
        performance: { categories: performanceCategories },
      }),
    [score, keyData, activitySessions, averageSessions, performanceCategories],
  );

  const resolvedTargetInsights = targetInsights ?? animatedInsights;
  const normalizedUserId = String(userId ?? "12");

  const [daySelection, setDaySelection] = useState({ userId: null, index: 0 });
  const activeDayIndex =
    daySelection.userId === normalizedUserId
      ? daySelection.index
      : resolvedTargetInsights.defaultDayIndex;

  const handleSelectDay = useCallback(
    (nextIndex) => {
      setDaySelection((prev) =>
        prev.userId === normalizedUserId && prev.index === nextIndex
          ? prev
          : { userId: normalizedUserId, index: nextIndex },
      );
    },
    [normalizedUserId],
  );

  const roundedWeightDelta = Math.round(animatedInsights.weightDeltaNum);
  const animatedWeightDeltaText =
    roundedWeightDelta > 0 ? `+${roundedWeightDelta} kg` : `${roundedWeightDelta} kg`;

  const { proteinShare, carbShare, lipidShare, calorieBarPercent } = animatedInsights.macros;

  return (
    <section className="dashboard" aria-label={`Tableau de bord de l’athlète ${normalizedUserId}`}>
      <header className="dashboard-header">
        <div className="dashboard-header-main">
          <div className="athlete-eyebrow">
            <span className="route-chip tabular">{`/user/${normalizedUserId}`}</span>
            <span className="dir-tag">Chronomètre &amp; Piste</span>
            <span className="athlete-meta tabular">
              {age ? `${age} ans · Semaine 01–07 juil.` : "Semaine 01–07 juil."}
            </span>
          </div>

          <h1 className="dashboard-title">
            <span className="dashboard-greeting">Bonjour </span>
            <span className="dashboard-first-name">{firstName}</span>
          </h1>
          <p className="dashboard-subtitle">{resolvedTargetInsights.heroSubtitle}</p>
        </div>

        <div className="athlete-controls">
          <div className="profile-switcher" role="group" aria-label="Changer de profil athlète">
            <Link
              to="/user/12"
              className={`profile-tab${normalizedUserId === "12" ? " is-active" : ""}`}
              aria-current={normalizedUserId === "12" ? "page" : undefined}
            >
              <span>Karl Dovineau</span>
              <span className="profile-tab-badge tabular">#12</span>
            </Link>
            <Link
              to="/user/18"
              className={`profile-tab${normalizedUserId === "18" ? " is-active" : ""}`}
              aria-current={normalizedUserId === "18" ? "page" : undefined}
            >
              <span>Cecilia Ratorez</span>
              <span className="profile-tab-badge tabular">#18</span>
            </Link>
          </div>
          <Link to={`/user/${encodeURIComponent(normalizedUserId)}`} className="direct-link-btn">
            <span>Lien direct</span>
            <span className="tabular">{`/user/${normalizedUserId}`}</span>
          </Link>
        </div>
      </header>

      <div
        className={`switch-delta-banner${profileDelta ? " has-delta" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="switch-delta-main">
          <span className="switch-delta-tag">
            {profileDelta ? "Transition profil" : "Repère hebdo"}
          </span>
          <span>
            {profileDelta
              ? `${profileDelta.fromLabel} → ${profileDelta.toLabel} : ${profileDelta.summary}`
              : `${firstName} (#${normalizedUserId}) — ${resolvedTargetInsights.heroSubtitle}`}
          </span>
        </div>
        <div className="switch-delta-pills tabular">
          {profileDelta ? (
            <>
              <span className="delta-chip is-accent">{profileDelta.scoreChip}</span>
              <span className="delta-chip is-positive">{profileDelta.volumeChip}</span>
              <span className="delta-chip">{profileDelta.burnRadarChip}</span>
            </>
          ) : (
            <>
              <span className="delta-chip is-accent">
                {`Objectif ${resolvedTargetInsights.scorePercent}%`}
              </span>
              <span className="delta-chip is-positive">
                {`${resolvedTargetInsights.weightDeltaFormatted} sur 7j`}
              </span>
              <span className="delta-chip">
                {`${resolvedTargetInsights.sessionTotal} min · ${resolvedTargetInsights.activeDaysShort}`}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="weekly-strip" aria-label="Synthèse hebdomadaire et objectif">
        <article className="panel synth-card">
          <div className="synth-top">
            <div>
              <p className="panel-kicker">Ce qui a changé · 7 jours</p>
              <h2 className="panel-title">Poids &amp; Dépense active</h2>
            </div>
            <WeightSparkline kilograms={animatedInsights.kilograms} />
          </div>
          <div className="synth-value-row tabular">
            <span className="synth-value">{animatedWeightDeltaText}</span>
            <span className="synth-badge">{resolvedTargetInsights.weightRange}</span>
            <span className="synth-badge is-accent">
              {`${formatInt(animatedInsights.burnTotal)} kCal / 7j`}
            </span>
          </div>
          <p className="synth-detail">{resolvedTargetInsights.weightExplain}</p>
        </article>

        <article className="panel synth-card">
          <div className="synth-top">
            <div>
              <p className="panel-kicker">Cadence · L–D</p>
              <h2 className="panel-title">Volume d’entraînement</h2>
            </div>
            <span className="synth-badge tabular">{resolvedTargetInsights.activeDaysLabel}</span>
          </div>
          <div className="synth-value-row tabular">
            <span className="synth-value">{`${formatInt(animatedInsights.sessionTotal)} min`}</span>
            <span className="synth-badge">{resolvedTargetInsights.sessionMeanLabel}</span>
          </div>
          <p className="synth-detail">{resolvedTargetInsights.sessionExplain}</p>
        </article>

        <article className="panel synth-card">
          <div className="synth-top">
            <div>
              <p className="panel-kicker">Cap quotidien · Score</p>
              <h2 className="panel-title">Avancement objectif</h2>
            </div>
            <span className="synth-badge is-accent">{resolvedTargetInsights.goalStage}</span>
          </div>
          <div className="synth-value-row tabular">
            <span className="synth-value">{`${animatedInsights.scorePercent}%`}</span>
            <span className="synth-badge">{`${animatedInsights.remainingPercent}% restant`}</span>
          </div>
          <div className="mini-goal-track" aria-hidden="true">
            <div
              className="mini-goal-fill"
              style={{ width: `${animatedInsights.scorePercent}%` }}
            />
          </div>
          <p className="synth-detail">{resolvedTargetInsights.goalExplain}</p>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="charts-column">
          <article id="activity" className="panel panel-activity anchor-section" aria-label="Graphique d’activité quotidienne">
            <ActivityChart
              sessions={activitySessions}
              activeDayIndex={activeDayIndex}
              onSelectDay={handleSelectDay}
            />
          </article>
          <div className="small-panels-row">
            <article id="sessions" className="panel panel-small panel-sessions anchor-section">
              <AverageSessionsChart
                sessions={averageSessions}
                activeDayIndex={activeDayIndex}
                onSelectDay={handleSelectDay}
                totalMinutes={animatedInsights.sessionTotal}
                activeDaysShort={resolvedTargetInsights.activeDaysShort}
              />
            </article>
            <article id="performance" className="panel panel-small panel-performance anchor-section">
              <PerformanceRadar
                categories={performanceCategories}
                topLabel={resolvedTargetInsights.radarTopLabel}
                lowLabel={resolvedTargetInsights.radarLowLabel}
              />
            </article>
            <article id="score" className="panel panel-small panel-score anchor-section">
              <ScoreRadial score={score} />
            </article>
          </div>
        </div>

        <aside className="keydata-column" aria-label="Bilan nutritionnel quotidien">
          <div className="panel nutrition-header-card">
            <p className="panel-kicker">Carburant · KeyData</p>
            <h2 className="panel-title">Apports quotidiens</h2>
            <p className="chart-adds">
              <strong>Ce qu’il apporte :</strong> relie la charge d’entraînement aux apports P/G/L.
            </p>
            <div className="fuel-split-mini">
              <div className="fuel-split-bar" aria-hidden="true">
                <span className="fuel-seg" style={{ width: `${proteinShare}%`, background: "#3B82F6" }} />
                <span className="fuel-seg" style={{ width: `${carbShare}%`, background: "#EAB308" }} />
                <span className="fuel-seg" style={{ width: `${lipidShare}%`, background: "#EC4899" }} />
              </div>
              <span className="fuel-split-caption tabular">
                {`P ${proteinShare}% · G ${carbShare}% · L ${lipidShare}%`}
              </span>
            </div>
          </div>

          <div className="macro-cards-list">
            <article className="panel keydata-card">
              <KeyDataCard
                label="Calories"
                value={keyData.calorieCount}
                unit="kCal"
                type="calories"
                shareLabel="base/j"
                barPercent={calorieBarPercent}
              />
            </article>
            <article className="panel keydata-card">
              <KeyDataCard
                label="Protéines"
                value={keyData.proteinCount}
                unit="g"
                type="proteins"
                shareLabel={`${proteinShare}%`}
                barPercent={proteinShare}
              />
            </article>
            <article className="panel keydata-card">
              <KeyDataCard
                label="Glucides"
                value={keyData.carbohydrateCount}
                unit="g"
                type="carbs"
                shareLabel={`${carbShare}%`}
                barPercent={carbShare}
              />
            </article>
            <article className="panel keydata-card">
              <KeyDataCard
                label="Lipides"
                value={keyData.lipidCount}
                unit="g"
                type="lipids"
                shareLabel={`${lipidShare}%`}
                barPercent={lipidShare}
              />
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}

DashboardSkeleton.propTypes = {
  userId: PropTypes.string,
  firstName: PropTypes.string,
  age: PropTypes.number,
  activitySessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      kilogram: PropTypes.number,
      calories: PropTypes.number,
    }),
  ),
  averageSessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessionLength: PropTypes.number,
    }),
  ),
  performanceCategories: PropTypes.arrayOf(
    PropTypes.shape({
      labelFr: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  score: PropTypes.number,
  keyData: PropTypes.shape({
    calorieCount: PropTypes.number,
    proteinCount: PropTypes.number,
    carbohydrateCount: PropTypes.number,
    lipidCount: PropTypes.number,
  }),
  targetInsights: PropTypes.object,
  profileDelta: PropTypes.object,
};

export default DashboardSkeleton;
