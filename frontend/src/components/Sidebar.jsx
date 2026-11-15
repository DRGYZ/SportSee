import React from "react";
import { Link } from "react-router-dom";
import { assetPath } from "../utils/assetPath";

function ActivityShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src={assetPath("sidebar-activity.png")} alt="" />
  );
}

function SessionsShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src={assetPath("sidebar-sessions.png")} alt="" />
  );
}

function PerformanceShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src={assetPath("sidebar-performance.png")} alt="" />
  );
}

function ScoreShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src={assetPath("sidebar-score.png")} alt="" />
  );
}

function Sidebar({ userId = "12" }) {
  const currentUserId = encodeURIComponent(userId);
  const shortcuts = [
    {
      to: `/user/${currentUserId}#activity`,
      label: "Activité",
      icon: <ActivityShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#sessions`,
      label: "Sessions",
      icon: <SessionsShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#performance`,
      label: "Performance",
      icon: <PerformanceShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#score`,
      label: "Objectif",
      icon: <ScoreShortcutIcon />,
    },
  ];

  return (
    <nav className="left-sidebar" aria-label="Raccourcis des graphiques">
      {shortcuts.map((shortcut) => (
        <Link key={shortcut.label} to={shortcut.to} className="sidebar-icon-link" aria-label={shortcut.label}>
          {shortcut.icon}
          <span className="sidebar-shortcut-label">{shortcut.label}</span>
        </Link>
      ))}
      <p className="sidebar-copyright">Copyright, SportSee 2020</p>
    </nav>
  );
}

export default Sidebar;
