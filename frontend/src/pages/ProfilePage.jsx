import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { loadDashboard } from "../services/dataProvider";

const isDebugEnabled = import.meta.env.VITE_DEBUG === "true";

function ProfileDashboard({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(id, controller.signal).then(
      (dashboard) => {
        if (!controller.signal.aborted) setData(dashboard);
      },
      (failure) => {
        if (!controller.signal.aborted) setError(failure);
      },
    );
    return () => controller.abort();
  }, [id, attempt]);

  if (error) {
    const isMissing = error.status === 404;
    return (
      <section className="page-card">
        <h1 className="page-title">{isMissing ? "Profil introuvable" : "Tableau de bord indisponible"}</h1>
        <p className="page-subtitle" role="alert">
          {isMissing ? "Choisissez un profil depuis l’accueil." : "Les données n’ont pas pu être chargées."}
        </p>
        {isMissing ? <Link className="page-link" to="/home">Voir les profils</Link> : (
          <button className="page-link" type="button" onClick={() => {
            setError(null);
            setAttempt((count) => count + 1);
          }}>Réessayer</button>
        )}
        {isDebugEnabled ? <p className="debug-error">{error.message}</p> : null}
      </section>
    );
  }

  if (!data) return <p role="status">Chargement…</p>;

  return (
    <>
      <DashboardSkeleton
        userId={id}
        firstName={data.user.firstName}
        activitySessions={data.activity.sessions}
        averageSessions={data.averageSessions.sessions}
        performanceCategories={data.performance.categories}
        score={data.user.score}
        keyData={data.user.keyData}
      />
      {isDebugEnabled ? (
        <details className="debug-panel">
          <summary>Données du profil</summary>
          <pre className="debug-json">{JSON.stringify(data, null, 2)}</pre>
        </details>
      ) : null}
    </>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  return <ProfileDashboard key={id} id={id} />;
}
