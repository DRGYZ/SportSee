import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
    (value, index, values) => values.indexOf(value) === index,
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

  const kilogramValue = Math.round(payload.find((item) => item.dataKey === "kilogram")?.value ?? 0);
  const caloriesValue = Math.round(payload.find((item) => item.dataKey === "calories")?.value ?? 0);

  return (
    <div className="activity-tooltip" aria-hidden="true">
      <p>{`${kilogramValue} kg`}</p>
      <p>{`${caloriesValue} kCal`}</p>
    </div>
  );
}

ActivityTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ dataKey: PropTypes.string, value: PropTypes.number })),
};

function ActivityChart({ sessions = [], activeDayIndex = null, onSelectDay = null }) {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const [isPointerInside, setIsPointerInside] = useState(false);

  if (safeSessions.length === 0) {
    return <p className="activity-chart-empty">Aucune donnee d&apos;activite disponible.</p>;
  }

  const chartData = toChartData(safeSessions);
  const kilogramScale = getKilogramScale(chartData);
  const maxDayIndex = chartData.length - 1;
  const resolvedDayIndex =
    Number.isInteger(activeDayIndex) && activeDayIndex >= 0 && activeDayIndex <= maxDayIndex
      ? activeDayIndex
      : maxDayIndex;
  const activePoint = chartData[resolvedDayIndex] ?? chartData[maxDayIndex];
  const pinnedLeftPercent = Math.min(
    89,
    Math.max(10, ((resolvedDayIndex + 0.5) / chartData.length) * 100),
  );

  function handleChartPointer(chartState) {
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
    <div className="activity-chart">
      <div className="activity-chart-header">
        <div>
          <p className="panel-kicker">01 · Croisement Masse × Dépense</p>
          <h2 className="activity-chart-title panel-title">Activité quotidienne</h2>
          <p className="chart-adds">
            <strong>Ce qu’il apporte :</strong> relie la variation de masse (kg) à l’intensité
            calorique brûlée (kCal) jour par jour.
          </p>
        </div>

        <div className="activity-header-right">
          <div className="activity-legend-list" aria-hidden="true">
            <span className="activity-legend-item">
              <span className="activity-legend-dot activity-legend-kg" />
              Poids (kg)
            </span>
            <span className="activity-legend-item">
              <span className="activity-legend-dot activity-legend-kcal" />
              Calories brûlées (kCal)
            </span>
          </div>

          <div className="activity-scrubber-row">
            <span className="day-inspect-pill tabular" data-testid="activity-inspect-pill">
              {`J${resolvedDayIndex + 1} · ${Math.round(activePoint.kilogram)} kg · ${Math.round(activePoint.calories)} kCal`}
            </span>
            <div className="day-scrubber-group" role="group" aria-label="Inspecter un jour">
              {chartData.map((entry, idx) => (
                <button
                  key={entry.dayLabel}
                  type="button"
                  className={`day-scrub-btn${idx === resolvedDayIndex ? " is-active" : ""}`}
                  aria-pressed={idx === resolvedDayIndex}
                  onClick={() => onSelectDay?.(idx)}
                >
                  {`J${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="activity-chart-content"
        onMouseEnter={() => setIsPointerInside(true)}
        onMouseLeave={() => setIsPointerInside(false)}
      >
        {!isPointerInside ? (
          <div
            className="activity-pinned-tooltip tabular"
            style={{ left: `${pinnedLeftPercent}%` }}
            aria-hidden="true"
          >
            <div>{`${Math.round(activePoint.kilogram)} kg`}</div>
            <div>{`${Math.round(activePoint.calories)} kCal`}</div>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height={224}>
          <BarChart
            data={chartData}
            barGap={8}
            barCategoryGap="28%"
            margin={{ top: 16, right: 8, left: 4, bottom: 4 }}
            onMouseMove={handleChartPointer}
            onClick={handleChartPointer}
          >
            <CartesianGrid stroke="#ECEAE3" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#787F8C", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              yAxisId="kg"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#787F8C", fontSize: 12 }}
              allowDecimals={false}
              ticks={kilogramScale.ticks}
              domain={kilogramScale.domain}
            />
            <YAxis yAxisId="kcal" hide />
            <Tooltip content={<ActivityTooltip />} cursor={{ fill: "rgba(17, 19, 23, 0.05)" }} />
            <Bar
              yAxisId="kg"
              dataKey="kilogram"
              name="kilogram"
              fill="#111317"
              radius={[5, 5, 0, 0]}
              barSize={8}
              isAnimationActive={false}
            />
            <Bar
              yAxisId="kcal"
              dataKey="calories"
              name="calories"
              fill="#E11D24"
              radius={[5, 5, 0, 0]}
              barSize={8}
              isAnimationActive={false}
            />
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
    }),
  ),
  activeDayIndex: PropTypes.number,
  onSelectDay: PropTypes.func,
};

export default memo(ActivityChart);
