import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { DATA_SOURCE_MODE } from "../services/dataProvider";
import { assetPath } from "../utils/assetPath";

function Header({ userId = "12" }) {
  const navigationItems = [
    { label: "Accueil", to: "/home" },
    { label: "Profil", to: `/user/${encodeURIComponent(userId)}` },
    { label: "Réglage", to: "/settings" },
    { label: "Communauté", to: "/community" },
  ];

  return (
    <header className="top-header">
      <Link to="/home" className="brand-link" aria-label="Accueil SportSee">
        <img className="brand-mark" src={assetPath("logo.png")} alt="SportSee" />
      </Link>
      <nav className="top-nav" aria-label="Navigation principale">
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) => `top-nav-link${isActive ? " is-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-meta">
        <span className="source-pill" data-mode={DATA_SOURCE_MODE}>
          <span className="source-dot" aria-hidden="true" />
          <span>{DATA_SOURCE_MODE === "api" ? "API · Express :3000" : "DEMO · demoData.json"}</span>
        </span>
      </div>
    </header>
  );
}

Header.propTypes = {
  userId: PropTypes.string,
};

export default Header;
