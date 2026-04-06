import React from "react";
import PropTypes from "prop-types";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const DISPLAY_ORDER = ["Intensité", "Vitesse", "Force", "Endurance", "Énergie", "Cardio"];

function normalizeLabel(label) {
  return String(label ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const displayOrderMap = DISPLAY_ORDER.reduce((acc, label, index) => {
    acc[normalizeLabel(label)] = index;
    return acc;
  }, {});

  return safeCategories
    .map((item) => ({
      labelFr: String(item?.labelFr ?? ""),
      value: Number(item?.value ?? 0),
    }))
    .sort((leftItem, rightItem) => {
      const leftOrder = displayOrderMap[normalizeLabel(leftItem.labelFr)] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = displayOrderMap[normalizeLabel(rightItem.labelFr)] ?? Number.MAX_SAFE_INTEGER;

      return leftOrder - rightOrder;
    });
}

function PerformanceRadar({ categories }) {
  const chartData = normalizeCategories(categories);

  if (chartData.length === 0) {
    return <p className="performance-radar-empty">Aucune donnee de performance disponible.</p>;
  }

  return (
    <div className="performance-radar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="52%" outerRadius="68%" startAngle={90} endAngle={-270}>
          <PolarGrid radialLines={false} stroke="#ffffff" strokeOpacity={0.28} />
          <PolarAngleAxis
            dataKey="labelFr"
            tickLine={false}
            tick={{ fontSize: 12, fill: "#ffffff", fontWeight: 500 }}
          />
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
