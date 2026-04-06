import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function StaticPage({ eyebrow, title, description }) {
  return (
    <section className="page-card">
      <p className="page-kicker">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{description}</p>

      <div className="page-grid">
        <article className="page-block">
          <h2 className="page-block-title">Navigation principale</h2>
          <p className="page-block-text">
            Le menu horizontal reste accessible pour basculer entre les ecrans principaux de
            l'application.
          </p>
        </article>
        <article className="page-block">
          <h2 className="page-block-title">Retour au dashboard</h2>
          <p className="page-block-text">
            Revenez a tout moment sur le profil utilisateur et utilisez la navigation laterale pour
            atteindre directement les blocs du dashboard.
          </p>
        </article>
      </div>

      <div className="page-actions">
        <Link className="page-link" to="/user/12">
          Voir le profil par defaut
        </Link>
        <Link className="page-link page-link-secondary" to="/home">
          Retour a l'accueil
        </Link>
      </div>
    </section>
  );
}

StaticPage.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default StaticPage;
