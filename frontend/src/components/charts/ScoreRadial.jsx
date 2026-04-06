import React from "react";
import PropTypes from "prop-types";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

function clampScore(score) {
  const value = Number(score ?? 0);
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function ScoreRadial({ score }) {
  const clampedScore = clampScore(score);
  const percent = Math.round(clampedScore * 100);
  const chartData = [{ value: percent }];

  return (
    <div className="score-radial-chart">
      <h3 className="score-radial-title">Score</h3>
      <div className="score-radial-content">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="74%"
            outerRadius="90%"
            startAngle={90}
            endAngle={90 + 360}
            barSize={10}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              fill="#ff0101"
              background={{ fill: "#fbfbfb" }}
              cornerRadius={10}
              clockWise
              animationDuration={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="score-radial-center">
          <p className="score-radial-percent">{`${percent}%`}</p>
          <p className="score-radial-label">de votre objectif</p>
        </div>
      </div>
    </div>
  );
}

ScoreRadial.propTypes = {
  score: PropTypes.number,
};

ScoreRadial.defaultProps = {
  score: 0,
};

export default ScoreRadial;
