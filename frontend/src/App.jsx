import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/12" replace />} />
      <Route path="/user/:id" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
