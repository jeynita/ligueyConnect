import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

import Login           from "./pages/Login";
import Register        from "./pages/Register";
import ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword   from "./pages/ResetPassword";
import Dashboard       from "./pages/Dashboard";
import ProfileEdit     from "./pages/ProfileEdit";
import ServiceCreate   from "./pages/ServiceCreate";
import ServiceList     from "./pages/ServiceList";
import ServiceSearch   from "./pages/ServiceSearch";
import OffreCreate     from "./pages/OffreCreate";
import OffreList       from "./pages/OffreList";
import OffreSearch     from "./pages/OffreSearch";
import OffrePostuler   from "./pages/OffrePostuler";
import CandidatureList from "./pages/CandidatureList";
import MessageList     from "./pages/MessageList";
import MessageChat     from "./pages/MessageChat";

// ProtectedRoute - verifie la session Supabase
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#671E30" }}>
        Chargement...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      {/* Routes publiques */}
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />

      {/* Recherche publique */}
      <Route path="/services/search" element={<ServiceSearch />} />
      <Route path="/offres/search"   element={<OffreSearch />} />

      {/* Routes protegees */}
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />

      <Route path="/services/create" element={<ProtectedRoute><ServiceCreate /></ProtectedRoute>} />
      <Route path="/services/me"     element={<ProtectedRoute><ServiceList /></ProtectedRoute>} />

      <Route path="/offres/create" element={<ProtectedRoute><OffreCreate /></ProtectedRoute>} />
      <Route path="/offres/me"     element={<ProtectedRoute><OffreList /></ProtectedRoute>} />

      <Route path="/offres/:offreId/postuler" element={<ProtectedRoute><OffrePostuler /></ProtectedRoute>} />
      <Route path="/candidatures"             element={<ProtectedRoute><CandidatureList /></ProtectedRoute>} />

      <Route path="/messages"              element={<ProtectedRoute><MessageList /></ProtectedRoute>} />
      <Route path="/messages/:otherUserId" element={<ProtectedRoute><MessageChat /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}
