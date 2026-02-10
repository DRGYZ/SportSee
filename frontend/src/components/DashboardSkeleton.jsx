import React from "react";
import PropTypes from "prop-types";
import ActivityChart from "./charts/ActivityChart";
import AverageSessionsChart from "./charts/AverageSessionsChart";
import PerformanceRadar from "./charts/PerformanceRadar";
import ScoreRadial from "./charts/ScoreRadial";
import KeyDataCard from "./ui/KeyDataCard";

function DashboardSkeleton({
  userId,
  firstName,
  activitySessions,
  averageSessions,
  performanceCategories,
  score,
  keyData,
}) {
  return (
    <section className="dashboard" aria-label={`profile dashboard user ${userId}`}>
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="dashboard-greeting">Bonjour </span>
          <span className="dashboard-first-name">{firstName}</span>
        </h1>
        <p className="dashboard-subtitle">
          Felicitation ! Vous avez explose vos objectifs hier 👏
        </p>
      </header>

      <div className="dashboard-grid">
        <div className="charts-column">
          <article className="panel panel-activity" aria-label="activity chart">
            <ActivityChart sessions={activitySessions} />
          </article>
          <div className="small-panels-row">
            <article className="panel panel-small panel-sessions">
              <AverageSessionsChart sessions={averageSessions} />
            </article>
            <article className="panel panel-small panel-performance">
              <PerformanceRadar categories={performanceCategories} />
            </article>
            <article className="panel panel-small panel-score">
              <ScoreRadial score={score} />
            </article>
          </div>
        </div>

        <div className="keydata-column">
          <article className="panel keydata-card">
            <KeyDataCard label="Calories" value={keyData.calorieCount} unit="kCal" type="calories" />
          </article>
          <article className="panel keydata-card">
            <KeyDataCard label="Protéines" value={keyData.proteinCount} unit="g" type="proteins" />
          </article>
          <article className="panel keydata-card">
            <KeyDataCard label="Glucides" value={keyData.carbohydrateCount} unit="g" type="carbs" />
          </article>
          <article className="panel keydata-card">
            <KeyDataCard label="Lipides" value={keyData.lipidCount} unit="g" type="lipids" />
          </article>
        </div>
      </div>
    </section>
  );
}

DashboardSkeleton.propTypes = {
  userId: PropTypes.string,
  firstName: PropTypes.string,
  activitySessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      kilogram: PropTypes.number,
      calories: PropTypes.number,
    })
  ),
  averageSessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessionLength: PropTypes.number,
    })
  ),
  performanceCategories: PropTypes.arrayOf(
    PropTypes.shape({
      labelFr: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  score: PropTypes.number,
  keyData: PropTypes.shape({
    calorieCount: PropTypes.number,
    proteinCount: PropTypes.number,
    carbohydrateCount: PropTypes.number,
    lipidCount: PropTypes.number,
  }),
};

DashboardSkeleton.defaultProps = {
  userId: "12",
  firstName: "Utilisateur",
  activitySessions: [],
  averageSessions: [],
  performanceCategories: [],
  score: 0,
  keyData: {},
};

export default DashboardSkeleton;
