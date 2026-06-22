import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import StaticPage from "./pages/StaticPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/user/12" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/:id" element={<ProfilePage />} />
        <Route
          path="/settings"
          element={
            <StaticPage
              eyebrow="Reglage"
              title="Personnalisez votre espace."
              description="Cet ecran est disponible depuis la navigation principale pour representer les futurs reglages de l'application."
            />
          }
        />
        <Route
          path="/community"
          element={
            <StaticPage
              eyebrow="Communaute"
              title="Retrouvez votre espace communaute."
              description="Cet ecran est disponible depuis la navigation principale pour representer les futurs contenus communautaires."
            />
          }
        />
        <Route path="*" element={<Navigate to="/user/12" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
