import React from "react";
import PropTypes from "prop-types";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

function normalizeCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  return safeCategories.map((item) => ({
    labelFr: String(item?.labelFr ?? ""),
    value: Number(item?.value ?? 0),
  }));
}

function PerformanceRadar({ categories }) {
  const chartData = normalizeCategories(categories);

  if (chartData.length === 0) {
    return <p className="performance-radar-empty">Aucune donnee de performance disponible.</p>;
  }

  return (
    <div className="performance-radar-chart">
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="labelFr" tick={{ fontSize: 11, fill: "#ffffff" }} />
          <Radar dataKey="value" fill="#ff0101" fillOpacity={0.7} stroke="#ff0101" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

PerformanceRadar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      labelFr: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};

PerformanceRadar.defaultProps = {
  categories: [],
};

export default PerformanceRadar;
