import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function HashScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const targetId = location.hash.slice(1);
    let attemptCount = 0;
    let timeoutId = 0;

    function scrollToTarget() {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attemptCount >= 20) {
        return;
      }

      attemptCount += 1;
      timeoutId = window.setTimeout(scrollToTarget, 100);
    }

    scrollToTarget();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  return null;
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <div className="body-shell">
        <Sidebar />
        <main className="main-content">
          <HashScrollManager />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
