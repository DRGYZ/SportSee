import React from "react";
import { Link, useParams } from "react-router-dom";

const DEFAULT_USER_ID = "12";

function ActivityShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src="/sidebar-activity.png" alt="" />
  );
}

function SessionsShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src="/sidebar-sessions.png" alt="" />
  );
}

function PerformanceShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src="/sidebar-performance.png" alt="" />
  );
}

function ScoreShortcutIcon() {
  return (
    <img className="sidebar-icon-image" src="/sidebar-score.png" alt="" />
  );
}

function Sidebar() {
  const { id } = useParams();
  const currentUserId = id ?? DEFAULT_USER_ID;
  const shortcuts = [
    {
      to: `/user/${currentUserId}#activity`,
      label: "Go to daily activity chart",
      icon: <ActivityShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#sessions`,
      label: "Go to average sessions chart",
      icon: <SessionsShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#performance`,
      label: "Go to performance chart",
      icon: <PerformanceShortcutIcon />,
    },
    {
      to: `/user/${currentUserId}#score`,
      label: "Go to score chart",
      icon: <ScoreShortcutIcon />,
    },
  ];

  return (
    <aside className="left-sidebar" aria-label="quick actions">
      {shortcuts.map((shortcut) => (
        <Link key={shortcut.label} to={shortcut.to} className="sidebar-icon-link" aria-label={shortcut.label}>
          {shortcut.icon}
        </Link>
      ))}
      <p className="sidebar-copyright">Copyright, SportSee 2020</p>
    </aside>
  );
}

export default Sidebar;
