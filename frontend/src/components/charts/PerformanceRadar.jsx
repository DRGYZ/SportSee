import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { sortPerformanceCategories } from "../../models/dashboardInsights";

function PerformanceRadar({ categories = [], topLabel = "", lowLabel = "" }) {
  const chartData = sortPerformanceCategories(categories);

  if (chartData.length === 0) {
    return <p className="performance-radar-empty">Aucune donnee de performance disponible.</p>;
  }

  let resolvedTop = topLabel;
  let resolvedLow = lowLabel;
  if (!resolvedTop || !resolvedLow) {
    const topCat = chartData.reduce((best, c) => (!best || c.value > best.value ? c : best), null);
    const lowCat = chartData.reduce((worst, c) => (!worst || c.value < worst.value ? c : worst), null);
    resolvedTop = resolvedTop || (topCat ? `Pic : ${topCat.labelFr} ${Math.round(topCat.value)}` : "—");
    resolvedLow = resolvedLow || (lowCat ? `Creux : ${lowCat.labelFr} ${Math.round(lowCat.value)}` : "—");
  }

  return (
    <div className="performance-radar-panel">
      <div>
        <p className="panel-kicker perf-kicker">03 · Équilibre 6 qualités</p>
        <h2 className="panel-title perf-title">Profil de performance</h2>
        <p className="chart-adds perf-adds">
          <strong>Ce qu’il apporte :</strong> cartographie forces dominantes et axes à renforcer.
        </p>
      </div>

      <div className="performance-radar-chart">
        <ResponsiveContainer width="100%" height={192}>
          <RadarChart
            data={chartData}
            cx="50%"
            cy="52%"
            outerRadius="63%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid radialLines={false} stroke="rgba(255,255,255,0.18)" />
            <PolarAngleAxis
              dataKey="labelFr"
              tickLine={false}
              tick={{ fontSize: 11, fill: "#E2E8F0", fontWeight: 600 }}
            />
            <Radar
              dataKey="value"
              fill="#E11D24"
              fillOpacity={0.62}
              stroke="#FF3B30"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="radar-foot tabular">
        <span>{resolvedTop}</span>
        <span>{resolvedLow}</span>
      </div>
    </div>
  );
}

PerformanceRadar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      labelFr: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  topLabel: PropTypes.string,
  lowLabel: PropTypes.string,
};

export default memo(PerformanceRadar);
