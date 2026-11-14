import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DAY_FULL_LABELS, DAY_SHORT_LABELS } from "../../models/dashboardInsights";

function toDayLabel(dayValue, index) {
  const dayNumber = Number(dayValue);
  if (Number.isFinite(dayNumber) && dayNumber >= 1 && dayNumber <= 7) {
    return DAY_SHORT_LABELS[dayNumber - 1];
  }

  return DAY_SHORT_LABELS[index] ?? "";
}

function toChartData(sessions) {
  return sessions.map((session, index) => ({
    dayIndex: index,
    dayLabel: toDayLabel(session?.day, index),
    sessionLength: Number(session?.sessionLength ?? 0),
  }));
}

function AverageSessionsTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const minutes = Math.round(payload[0]?.value ?? 0);

  return (
    <div className="average-sessions-tooltip tabular" aria-hidden="true">
      <p>{`${minutes} min`}</p>
    </div>
  );
}

AverageSessionsTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number })),
};

function AverageSessionsChart({
  sessions = [],
  activeDayIndex = null,
  onSelectDay = null,
  totalMinutes = null,
  activeDaysShort = "",
}) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const [hoverX, setHoverX] = useState(null);

  if (safeSessions.length === 0) {
    return <p className="average-sessions-empty">Aucune donnee de session disponible.</p>;
  }

  const chartData = toChartData(safeSessions);
  const maxIdx = chartData.length - 1;
  const resolvedDayIndex =
    Number.isInteger(activeDayIndex) && activeDayIndex >= 0 && activeDayIndex <= maxIdx
      ? activeDayIndex
      : maxIdx;
  const activeSession = chartData[resolvedDayIndex] ?? chartData[maxIdx];
  const dayPercentLeft = Math.round(((resolvedDayIndex + 0.5) / chartData.length) * 100);
  const pillLeft = Math.min(86, Math.max(14, dayPercentLeft));

  const computedTotal =
    totalMinutes !== null
      ? totalMinutes
      : chartData.reduce((sum, item) => sum + item.sessionLength, 0);
  const computedDaysShort =
    activeDaysShort ||
    `${chartData.filter((item) => item.sessionLength > 0).length}/${chartData.length} j`;

  function handleMouseMove(chartState) {
    const activeX = chartState?.activeCoordinate?.x;
    setHoverX(Number.isFinite(activeX) ? activeX : null);

    const idx = Number(chartState?.activeTooltipIndex);
    if (
      chartState?.isTooltipActive &&
      Number.isInteger(idx) &&
      idx >= 0 &&
      idx < chartData.length &&
      idx !== resolvedDayIndex
    ) {
      onSelectDay?.(idx);
    }
  }

  return (
    <div className="average-sessions-chart">
      <div
        className={`average-sessions-hover-overlay${hoverX !== null ? " is-hovering" : ""}`}
        style={{ left: hoverX !== null ? hoverX : `${dayPercentLeft}%` }}
      />
      <div className="average-sessions-inner">
        <div>
          <p className="panel-kicker sessions-kicker">02 · Rythme hebdomadaire</p>
          <h2 className="average-sessions-title">Durée moyenne des sessions</h2>
          <p className="chart-adds sessions-adds">
            <strong>Ce qu’il apporte :</strong> révèle les jours de récupération et les pics
            d’endurance (L–D).
          </p>
        </div>

        <div className="average-sessions-content">
          {hoverX === null ? (
            <div
              className="sessions-active-pill tabular"
              style={{ left: `${pillLeft}%` }}
              aria-hidden="true"
            >
              {`${Math.round(activeSession.sessionLength)} min`}
            </div>
          ) : null}

          <ResponsiveContainer width="100%" height={148}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 8, left: 8, bottom: 4 }}
              onMouseMove={handleMouseMove}
              onClick={handleMouseMove}
              onMouseLeave={() => setHoverX(null)}
            >
              <XAxis
                dataKey="dayIndex"
                tickFormatter={(index) => chartData[index]?.dayLabel ?? ""}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.78)", fontSize: 12, fontWeight: 600 }}
                padding={{ left: 6, right: 6 }}
              />
              <YAxis hide domain={["dataMin - 10", "dataMax + 14"]} />
              <Tooltip content={<AverageSessionsTooltip />} animationDuration={0} cursor={false} />
              <Line
                type="monotone"
                dataKey="sessionLength"
                stroke="#ffffff"
                strokeOpacity={0.95}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "rgba(255,255,255,0.35)",
                  strokeWidth: 8,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="sessions-foot tabular">
          <span data-testid="sessions-day-readout">
            {`${DAY_FULL_LABELS[resolvedDayIndex] ?? "Dim."} : ${Math.round(activeSession.sessionLength)} min`}
          </span>
          <span>{`${Math.round(computedTotal)} min · ${computedDaysShort}`}</span>
        </div>
      </div>
    </div>
  );
}

AverageSessionsChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessionLength: PropTypes.number,
    }),
  ),
  activeDayIndex: PropTypes.number,
  onSelectDay: PropTypes.func,
  totalMinutes: PropTypes.number,
  activeDaysShort: PropTypes.string,
};

export default memo(AverageSessionsChart);
