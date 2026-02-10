import React from "react";
function Header() {
  return (
    <header className="top-header">
      <div className="brand">SportSee</div>
      <nav className="top-nav" aria-label="main navigation">
        <a href="#" className="top-nav-link">
          Accueil
        </a>
        <a href="#" className="top-nav-link">
          Profil
        </a>
        <a href="#" className="top-nav-link">
          Réglage
        </a>
        <a href="#" className="top-nav-link">
          Communauté
        </a>
      </nav>
    </header>
  );
}

export default Header;
