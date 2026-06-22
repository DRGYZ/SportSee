import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";
import {
  getUserActivity,
  getUserAverageSessions,
  getUserMainData,
  getUserPerformance,
} from "../services/dataProvider";

const isDebugEnabled = import.meta.env.VITE_DEBUG === "true";

/**
 * Load and render the SportSee dashboard for the current user route.
 * Data is fetched through the provider layer so the page stays decoupled
 * from API and mock implementation details.
 */
function ProfilePage() {
  const { id } = useParams();
  const [debugData, setDebugData] = useState({
    user: null,
    activity: null,
    averageSessions: null,
    performance: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadUserData() {
      setIsLoading(true);
      setError("");

      try {
        const [user, activity, averageSessions, performance] = await Promise.all([
          getUserMainData(id),
          getUserActivity(id),
          getUserAverageSessions(id),
          getUserPerformance(id),
        ]);

        if (!isCancelled) {
          setDebugData({
            user,
            activity,
            averageSessions,
            performance,
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
    <>
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
    </>
  );
}

export default ProfilePage;
