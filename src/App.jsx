import { GlobalPopupProvider } from "./Pages/GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./Pages/Home/MainPage";
import Maintenance from "./Pages/GlobalFunctions/Maintenance";
import Login from "./Pages/OnboardingRelated/Login/Login";
import Join from "./Pages/OnboardingRelated/Join/Join";
import ForgotPassword from "./Pages/OnboardingRelated/ForgotPassword/ForgotPassword";
import ChangePassword from "./Pages/OnboardingRelated/ForgotPassword/ChangePassword";
import RequestSignup from "./Pages/OnboardingRelated/Signup/RequestSignup";
import Signup from "./Pages/OnboardingRelated/Signup/Signup";
import ProtectedRoute from "./Api/ProtectedRoute";
import AdminPage from "./Pages/AdminPortal/AdminPage";

import "./Pages/GlobalFunctions/GlobalPopup/GlobalPopup.css";
import ProjectPage from "./Pages/ProjectPage/ProjectPage";

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

function App() {
  if (isMaintenance) return <Maintenance />;

  return (
    <GlobalPopupProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/signup" element={<RequestSignup />} />
          <Route path="/signup-otp" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalPopupProvider>
  );
}

export default App;
