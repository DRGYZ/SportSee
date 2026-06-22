import React from "react";
import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function normalizeDayLabel(dayValue, index) {
  if (typeof dayValue === "string") {
    const parsed = new Date(dayValue);
    if (!Number.isNaN(parsed.getTime())) {
      return String(index + 1);
    }
  }

  if (typeof dayValue === "number" && Number.isFinite(dayValue)) {
    return String(dayValue);
  }

  return String(index + 1);
}

function toChartData(sessions) {
  return sessions.map((session, index) => ({
    dayLabel: normalizeDayLabel(session?.day, index),
    kilogram: Number(session?.kilogram ?? 0),
    calories: Number(session?.calories ?? 0),
  }));
}

function getKilogramScale(chartData) {
  const kilograms = chartData
    .map((session) => Number(session?.kilogram ?? 0))
    .filter((value) => Number.isFinite(value));

  if (kilograms.length === 0) {
    return {
      domain: [0, 3],
      ticks: [0, 1, 2, 3],
    };
  }

  const minValue = Math.min(...kilograms);
  const maxValue = Math.max(...kilograms);
  const startTick = Math.floor(minValue) - 1;
  const endTick = Math.ceil(maxValue) + 1;
  const middleTick = Math.round((startTick + endTick) / 2);
  const ticks = [startTick, middleTick, endTick].filter(
    (value, index, values) => values.indexOf(value) === index
  );

  return {
    domain: [ticks[0], ticks[ticks.length - 1]],
    ticks,
  };
}

function ActivityTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const kilogramValue = payload.find((item) => item.dataKey === "kilogram")?.value ?? 0;
  const caloriesValue = payload.find((item) => item.dataKey === "calories")?.value ?? 0;

  return (
    <div className="activity-tooltip" role="status" aria-live="polite">
      <p>{`${kilogramValue}kg`}</p>
      <p>{`${caloriesValue}kCal`}</p>
    </div>
  );
}

ActivityTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ dataKey: PropTypes.string, value: PropTypes.number })),
};

ActivityTooltip.defaultProps = {
  active: false,
  payload: [],
};

function ActivityChart({ sessions }) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  if (safeSessions.length === 0) {
    return <p className="activity-chart-empty">Aucune donnee d'activite disponible.</p>;
  }

  const chartData = toChartData(safeSessions);
  const kilogramScale = getKilogramScale(chartData);

  return (
    <div className="activity-chart">
      <div className="activity-chart-header">
        <h2 className="activity-chart-title">Activite quotidienne</h2>
      </div>
      <div className="activity-chart-content">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={8} barCategoryGap={34} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
            <CartesianGrid stroke="#dedede" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dayLabel" tickLine={false} axisLine={false} tick={{ fill: "#9b9eac", fontSize: 14 }} />
            <YAxis
              yAxisId="kg"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9b9eac", fontSize: 14 }}
              allowDecimals={false}
              ticks={kilogramScale.ticks}
              domain={kilogramScale.domain}
            />
            <YAxis yAxisId="kcal" hide />
            <Tooltip content={<ActivityTooltip />} cursor={{ fill: "#c4c4c450" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ top: -4, right: 8, fontSize: 14 }}
              formatter={(value) => (value === "kilogram" ? "Poids (kg)" : "Calories brûlées (kCal)")}
            />
            <Bar yAxisId="kg" dataKey="kilogram" name="kilogram" fill="#282d30" radius={[50, 50, 0, 0]} barSize={7} />
            <Bar yAxisId="kcal" dataKey="calories" name="calories" fill="#e60000" radius={[50, 50, 0, 0]} barSize={7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

ActivityChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      kilogram: PropTypes.number,
      calories: PropTypes.number,
    })
  ),
};

ActivityChart.defaultProps = {
  sessions: [],
};

export default ActivityChart;
