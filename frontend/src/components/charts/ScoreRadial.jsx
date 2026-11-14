import React, { memo } from "react";
import PropTypes from "prop-types";

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clampScore(score) {
  const value = Number(score ?? 0);
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function ScoreRadial({ score = 0 }) {
  const clampedScore = clampScore(score);
  const percent = Math.round(clampedScore * 100);
  const remaining = Math.max(0, 100 - percent);
  const dashOffset = CIRCUMFERENCE * (1 - clampedScore);

  return (
    <div className="score-radial-chart">
      <div>
        <p className="panel-kicker">04 · Cap du jour</p>
        <h2 className="score-radial-title panel-title">Score d’objectif</h2>
        <p className="chart-adds">
          <strong>Ce qu’il apporte :</strong> mesure l’avancement journalier réalisé vs restant.
        </p>
      </div>

      <div className="score-radial-content">
        <svg
          className="score-radial-svg"
          width="158"
          height="158"
          viewBox="0 0 180 180"
          role="img"
          aria-label={`Score d'objectif : ${percent}% réalisé`}
        >
          <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#ECEAE3" strokeWidth="13" />
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke={clampedScore > 0 ? "#E11D24" : "transparent"}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div className="score-radial-center">
          <p className="score-radial-percent tabular">{`${percent}%`}</p>
          <p className="score-radial-label">de votre objectif</p>
        </div>
      </div>

      <div className="score-foot tabular">
        <span>{`${percent}% réalisé`}</span>
        <span>{`${remaining}% restant`}</span>
      </div>
    </div>
  );
}

ScoreRadial.propTypes = {
  score: PropTypes.number,
};

export default memo(ScoreRadial);
