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

  return (
    <div className="activity-chart">
      <div className="activity-chart-header">
        <h2 className="activity-chart-title">Activite quotidienne</h2>
      </div>
      <div className="activity-chart-content">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={8} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dayLabel" tickLine={false} axisLine={false} />
            <YAxis yAxisId="kg" orientation="right" axisLine={false} tickLine={false} />
            <YAxis yAxisId="kcal" hide />
            <Tooltip content={<ActivityTooltip />} cursor={{ fill: "#c4c4c450" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              formatter={(value) => (value === "kilogram" ? "Poids (kg)" : "Calories brûlées (kCal)")}
            />
            <Bar yAxisId="kg" dataKey="kilogram" name="kilogram" fill="#282d30" radius={[10, 10, 0, 0]} />
            <Bar yAxisId="kcal" dataKey="calories" name="calories" fill="#e60000" radius={[10, 10, 0, 0]} />
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
