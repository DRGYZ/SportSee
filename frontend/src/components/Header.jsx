import React from "react";
import { Link, NavLink } from "react-router-dom";
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
      <Link to="/home" className="brand-link" aria-label="Go to home screen">
        <img className="brand-mark" src={assetPath("logo.png")} alt="SportSee" />
      </Link>
      <nav className="top-nav" aria-label="main navigation">
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
    </header>
  );
}

export default Header;
