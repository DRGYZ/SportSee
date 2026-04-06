import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";

const DEFAULT_USER_ID = "12";

function Header() {
  const { id } = useParams();
  const currentUserId = id ?? DEFAULT_USER_ID;
  const navigationItems = [
    { label: "Accueil", to: "/home" },
    { label: "Profil", to: `/user/${currentUserId}` },
    { label: "Réglage", to: "/settings" },
    { label: "Communauté", to: "/community" },
  ];

  return (
    <header className="top-header">
      <Link to="/home" className="brand-link" aria-label="Go to home screen">
        <img className="brand-mark" src="/logo.png" alt="SportSee" />
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
