import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";
import {
  computeDashboardInsights,
  computeProfileDelta,
} from "../models/dashboardInsights";
import { loadDashboard } from "../services/dataProvider";

const isDebugEnabled = import.meta.env.VITE_DEBUG === "true";
const TRANSITION_DURATION_MS = 420;

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolateDashboard(from, to, t) {
  const fromKd = from.user?.keyData ?? {};
  const toKd = to.user?.keyData ?? {};
  const fromAct = from.activity?.sessions ?? [];
  const toAct = to.activity?.sessions ?? [];
  const fromSess = from.averageSessions?.sessions ?? [];
  const toSess = to.averageSessions?.sessions ?? [];
  const fromPerf = from.performance?.categories ?? [];
  const toPerf = to.performance?.categories ?? [];

  return {
    user: {
      ...to.user,
      score: lerp(Number(from.user?.score ?? 0), Number(to.user?.score ?? 0), t),
      keyData: {
        calorieCount: Math.round(lerp(Number(fromKd.calorieCount ?? 0), Number(toKd.calorieCount ?? 0), t)),
        proteinCount: Math.round(lerp(Number(fromKd.proteinCount ?? 0), Number(toKd.proteinCount ?? 0), t)),
        carbohydrateCount: Math.round(
          lerp(Number(fromKd.carbohydrateCount ?? 0), Number(toKd.carbohydrateCount ?? 0), t),
        ),
        lipidCount: Math.round(lerp(Number(fromKd.lipidCount ?? 0), Number(toKd.lipidCount ?? 0), t)),
      },
    },
    activity: {
      ...to.activity,
      sessions: toAct.map((item, idx) => {
        const prevItem = fromAct[idx] ?? item;
        return {
          ...item,
          kilogram: Number(lerp(Number(prevItem.kilogram ?? 0), Number(item.kilogram ?? 0), t).toFixed(2)),
          calories: Number(lerp(Number(prevItem.calories ?? 0), Number(item.calories ?? 0), t).toFixed(1)),
        };
      }),
    },
    averageSessions: {
      ...to.averageSessions,
      sessions: toSess.map((item, idx) => {
        const prevItem = fromSess[idx] ?? item;
        return {
          ...item,
          sessionLength: Number(
            lerp(Number(prevItem.sessionLength ?? 0), Number(item.sessionLength ?? 0), t).toFixed(1),
          ),
        };
      }),
    },
    performance: {
      ...to.performance,
      categories: toPerf.map((cat, idx) => {
        const prevCat =
          fromPerf.find((item) => item.labelFr === cat.labelFr) ?? fromPerf[idx] ?? cat;
        return {
          ...cat,
          value: Number(lerp(Number(prevCat.value ?? 0), Number(cat.value ?? 0), t).toFixed(1)),
        };
      }),
    },
  };
}

function useAnimatedDashboard(targetData) {
  const renderedRef = useRef(targetData);
  const [rendered, setRendered] = useState(targetData);

  useEffect(() => {
    if (!targetData) {
      renderedRef.current = null;
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const currentSnapshot = renderedRef.current;
    const isSameUser =
      currentSnapshot &&
      String(currentSnapshot.user?.id ?? "") === String(targetData.user?.id ?? "");

    if (!currentSnapshot || prefersReducedMotion || isSameUser) {
      renderedRef.current = targetData;
      const snapId = window.requestAnimationFrame(() => {
        setRendered(targetData);
      });
      return () => window.cancelAnimationFrame(snapId);
    }

    const from = currentSnapshot;
    const to = targetData;
    let startTime = null;
    let frameId = 0;

    function tick(now) {
      if (startTime === null) {
        startTime = now;
      }
      const rawT = Math.max(0, Math.min(1, (now - startTime) / TRANSITION_DURATION_MS));
      const easedT = easeOutExpo(rawT);
      const nextFrame = interpolateDashboard(from, to, easedT);
      renderedRef.current = nextFrame;
      setRendered(nextFrame);

      if (rawT < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        renderedRef.current = to;
        setRendered(to);
      }
    }

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [targetData]);

  return targetData ? (rendered ?? targetData) : null;
}

function ProfileDashboard({ id }) {
  const [dashState, setDashState] = useState({ current: null, previous: null });
  const [errorState, setErrorState] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(id, controller.signal).then(
      (dashboard) => {
        if (!controller.signal.aborted) {
          setErrorState(null);
          setDashState((prev) => {
            const nextPrevious =
              prev.current && String(prev.current.user?.id) !== String(dashboard.user?.id)
                ? prev.current
                : prev.previous;
            return { current: dashboard, previous: nextPrevious };
          });
        }
      },
      (failure) => {
        if (!controller.signal.aborted) {
          setErrorState({ failure, failedId: id });
        }
      },
    );
    return () => controller.abort();
  }, [id, attempt]);

  const targetData = dashState.current;
  const animatedData = useAnimatedDashboard(targetData);

  const profileDelta = useMemo(
    () => computeProfileDelta(dashState.previous, targetData),
    [dashState.previous, targetData],
  );
  const targetInsights = useMemo(
    () => (targetData ? computeDashboardInsights(targetData) : null),
    [targetData],
  );

  const activeError = errorState && errorState.failedId === id ? errorState.failure : null;

  if (activeError) {
    const isMissing = activeError.status === 404;
    return (
      <section className="page-card">
        <h1 className="page-title">{isMissing ? "Profil introuvable" : "Tableau de bord indisponible"}</h1>
        <p className="page-subtitle" role="alert">
          {isMissing ? "Choisissez un profil depuis l’accueil." : "Les données n’ont pas pu être chargées."}
        </p>
        {isMissing ? <Link className="page-link" to="/home">Voir les profils</Link> : (
          <button className="page-link" type="button" onClick={() => {
            setErrorState(null);
            setAttempt((count) => count + 1);
          }}>Réessayer</button>
        )}
        {isDebugEnabled ? <p className="debug-error">{activeError.message}</p> : null}
      </section>
    );
  }

  if (!targetData || !animatedData) return <p role="status">Chargement…</p>;

  return (
    <>
      <DashboardSkeleton
        userId={String(targetData.user?.id ?? id)}
        firstName={targetData.user.firstName}
        age={targetData.user.age}
        activitySessions={animatedData.activity.sessions}
        averageSessions={animatedData.averageSessions.sessions}
        performanceCategories={animatedData.performance.categories}
        score={animatedData.user.score}
        keyData={animatedData.user.keyData}
        targetInsights={targetInsights}
        profileDelta={profileDelta}
      />
      {isDebugEnabled ? (
        <details className="debug-panel">
          <summary>Données du profil</summary>
          <pre className="debug-json">{JSON.stringify(targetData, null, 2)}</pre>
        </details>
      ) : null}
    </>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  return <ProfileDashboard id={id} />;
}
