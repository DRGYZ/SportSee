import React from "react";
import { Link } from "react-router-dom";

const AVAILABLE_USERS = [
  {
    id: "12",
    name: "Karl Dovineau",
    description: "Consulter le dashboard de Karl avec les graphiques d'activite, de sessions, de performance et de score.",
  },
  {
    id: "18",
    name: "Cecilia Ratorez",
    description: "Consulter le dashboard de Cecilia avec les memes indicateurs et le meme parcours de navigation.",
  },
];

function HomePage() {
  return (
    <section className="page-card">
      <p className="page-kicker">Accueil</p>
      <h1 className="page-title">Bienvenue sur SportSee</h1>
      <p className="page-subtitle">
        Utilisez la navigation horizontale pour changer d'ecran et la barre laterale pour acceder
        rapidement aux principaux blocs du dashboard.
      </p>

      <div className="profile-picker">
        {AVAILABLE_USERS.map((user) => (
          <article key={user.id} className="profile-tile">
            <h2 className="profile-tile-title">{user.name}</h2>
            <p className="profile-tile-description">{user.description}</p>
            <Link className="page-link" to={`/user/${user.id}`}>
              Ouvrir le profil
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
