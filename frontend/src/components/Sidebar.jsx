import React from "react";
function Sidebar() {
  return (
    <aside className="left-sidebar" aria-label="quick actions">
      <button type="button" className="sidebar-icon-btn" aria-label="Meditation">
        M
      </button>
      <button type="button" className="sidebar-icon-btn" aria-label="Swimming">
        S
      </button>
      <button type="button" className="sidebar-icon-btn" aria-label="Cycling">
        C
      </button>
      <button type="button" className="sidebar-icon-btn" aria-label="Weightlifting">
        W
      </button>
      <p className="sidebar-copyright">Copiryght, SportSee 2020</p>
    </aside>
  );
}

export default Sidebar;
