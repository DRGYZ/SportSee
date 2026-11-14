import React, { memo } from "react";
import PropTypes from "prop-types";
import { formatInt } from "../../models/dashboardInsights";
import { assetPath } from "../../utils/assetPath";

function KeyDataIcon({ type }) {
  switch (type) {
    case "calories":
      return (
        <img className="keydata-icon-image" src={assetPath("calories-icon.png")} alt="" />
      );
    case "proteins":
      return (
        <img className="keydata-icon-image" src={assetPath("protein-icon.png")} alt="" />
      );
    case "carbs":
      return (
        <img className="keydata-icon-image" src={assetPath("carbs-icon.png")} alt="" />
      );
    case "lipids":
      return (
        <img className="keydata-icon-image" src={assetPath("fat-icon.png")} alt="" />
      );
    default:
      return null;
  }
}

function KeyDataCard({ label, value = 0, unit, type, shareLabel = "", barPercent = null }) {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const clampedBar =
    barPercent === null ? null : Math.max(4, Math.min(100, Math.round(Number(barPercent) || 0)));

  return (
    <div className="keydata-card-content">
      <div className={`keydata-icon keydata-icon-${type}`} aria-hidden="true">
        <KeyDataIcon type={type} />
      </div>
      <div className="keydata-text">
        <div className="keydata-value-row">
          <p className="keydata-value tabular">
            <span className="keydata-value-number">{formatInt(numericValue)}</span>
            <span className="keydata-value-unit">{unit}</span>
          </p>
          {shareLabel ? <span className="keydata-share tabular">{shareLabel}</span> : null}
        </div>
        <p className="keydata-label">{label}</p>
        {clampedBar !== null ? (
          <div className="keydata-bar" aria-hidden="true">
            <div className={`keydata-bar-fill keydata-bar-${type}`} style={{ width: `${clampedBar}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

KeyDataCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["calories", "proteins", "carbs", "lipids"]).isRequired,
  shareLabel: PropTypes.string,
  barPercent: PropTypes.number,
};

export default memo(KeyDataCard);
