import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardSkeleton from "../components/DashboardSkeleton";
import {
  getUserActivity,
  getUserAverageSessions,
  getUserMainData,
  getUserPerformance,
  getUserScore,
} from "../services/dataProvider";

const isDebugEnabled = import.meta.env.VITE_DEBUG === "true";

function ProfilePage() {
  const { id } = useParams();
  const [debugData, setDebugData] = useState({
    user: null,
    mainData: null,
    activity: null,
    averageSessions: null,
    performance: null,
    score: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadUserData() {
      setIsLoading(true);
      setError("");

      try {
        const [mainData, activity, averageSessions, performance, score] = await Promise.all([
          getUserMainData(id),
          getUserActivity(id),
          getUserAverageSessions(id),
          getUserPerformance(id),
          getUserScore(id),
        ]);

        if (!isCancelled) {
          setDebugData({
            user: mainData,
            mainData,
            activity,
            averageSessions,
            performance,
            score,
          });
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unknown data error");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return (
    <div className="app-shell">
      <Header />
      <div className="body-shell">
        <Sidebar />
        <main className="main-content">
          {isLoading ? <p>Chargement...</p> : null}
          {!isLoading && error ? <p className="debug-error">{error}</p> : null}
          {!isLoading && !error ? (
            <DashboardSkeleton
              userId={id}
              firstName={debugData.user?.firstName ?? "Utilisateur"}
              activitySessions={debugData.activity?.sessions ?? []}
              averageSessions={debugData.averageSessions?.sessions ?? []}
              performanceCategories={debugData.performance?.categories ?? []}
              score={debugData.user?.score ?? 0}
              keyData={debugData.user?.keyData ?? {}}
            />
          ) : null}
          {isDebugEnabled ? (
            <details className="debug-panel">
              <summary>Debug data preview</summary>
              <pre className="debug-json">{JSON.stringify(debugData, null, 2)}</pre>
            </details>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
