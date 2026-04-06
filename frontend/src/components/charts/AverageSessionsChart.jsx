import React from "react";
import PropTypes from "prop-types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function toDayLabel(dayValue, index) {
  const dayNumber = Number(dayValue);
  if (Number.isFinite(dayNumber) && dayNumber >= 1 && dayNumber <= 7) {
    return DAY_LABELS[dayNumber - 1];
  }

  return DAY_LABELS[index] ?? "";
}

function toChartData(sessions) {
  return sessions.map((session, index) => ({
    dayLabel: toDayLabel(session?.day, index),
    sessionLength: Number(session?.sessionLength ?? 0),
  }));
}

function AverageSessionsTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const minutes = payload[0]?.value ?? 0;

  return (
    <div className="average-sessions-tooltip" role="status" aria-live="polite">
      <p>{`${minutes} min`}</p>
    </div>
  );
}

AverageSessionsTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number })),
};

AverageSessionsTooltip.defaultProps = {
  active: false,
  payload: [],
};

function AverageSessionsChart({ sessions }) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];

  if (safeSessions.length === 0) {
    return <p className="average-sessions-empty">Aucune donnee de session disponible.</p>;
  }

  return (
    <div className="average-sessions-chart">
      <h3 className="average-sessions-title">Duree moyenne des sessions</h3>
      <div className="average-sessions-content">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={toChartData(safeSessions)} margin={{ top: 16, right: 6, left: 6, bottom: 8 }}>
            <XAxis
              dataKey="dayLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              padding={{ left: 6, right: 6 }}
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Tooltip content={<AverageSessionsTooltip />} animationDuration={0} />
            <Line
              type="monotone"
              dataKey="sessionLength"
              stroke="#ffffff"
              strokeOpacity={0.9}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#ffffff", stroke: "rgba(255,255,255,0.35)", strokeWidth: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

AverageSessionsChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessionLength: PropTypes.number,
    })
  ),
};

AverageSessionsChart.defaultProps = {
  sessions: [],
};

export default AverageSessionsChart;
