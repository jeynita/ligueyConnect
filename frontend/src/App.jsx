import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProfileEdit from "./pages/ProfileEdit";
import ServiceCreate from "./pages/ServiceCreate";
import ServiceList from "./pages/ServiceList";
import ServiceSearch from "./pages/ServiceSearch";
import OffreCreate from "./pages/OffreCreate"; 
import OffreList from "./pages/OffreList"; 
import OffreSearch from "./pages/OffreSearch"; 
import OffrePostuler from "./pages/OffrePostuler"; 
import CandidatureList from "./pages/CandidatureList"; 
import  MessageList from "./pages/MessageList"; 
import MessageChat from "./pages/MessageChat";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      {/* ⬇️ AJOUTER CES ROUTES */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile/edit"
        element={token ? <ProfileEdit /> : <Navigate to="/login" />}
      />
       {/* ⬇️ NOUVELLES ROUTES SERVICES */}
      <Route
        path="/services/create"
        element={token ? <ServiceCreate /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/services/me"
        element={token ? <ServiceList /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/services/search"
        element={<ServiceSearch />} // ⬅️ Public (pas besoin de token)
      />
      {/* ⬇️ ROUTES MESSAGES */}
      <Route
        path="/messages"
        element={token ? <MessageList /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/messages/:otherUserId"
        element={token ? <MessageChat /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
