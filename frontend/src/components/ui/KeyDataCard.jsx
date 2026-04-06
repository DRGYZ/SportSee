import React from "react";
import PropTypes from "prop-types";

function KeyDataIcon({ type }) {
  switch (type) {
    case "calories":
      return (
        <img className="keydata-icon-image" src="/calories-icon.png" alt="" />
      );
    case "proteins":
      return (
        <img className="keydata-icon-image" src="/protein-icon.png" alt="" />
      );
    case "carbs":
      return (
        <img className="keydata-icon-image" src="/carbs-icon.png" alt="" />
      );
    case "lipids":
      return (
        <img className="keydata-icon-image" src="/fat-icon.png" alt="" />
      );
    default:
      return null;
  }
}

function KeyDataCard({ label, value, unit, type }) {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return (
    <article className="keydata-card-content">
      <div className={`keydata-icon keydata-icon-${type}`} aria-hidden="true">
        <KeyDataIcon type={type} />
      </div>
      <div className="keydata-text">
        <p className="keydata-value">
          <span className="keydata-value-number">{numericValue}</span>
          <span className="keydata-value-unit">{unit}</span>
        </p>
        <p className="keydata-label">{label}</p>
      </div>
    </article>
  );
}

KeyDataCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["calories", "proteins", "carbs", "lipids"]).isRequired,
};

KeyDataCard.defaultProps = {
  value: 0,
};

export default KeyDataCard;
