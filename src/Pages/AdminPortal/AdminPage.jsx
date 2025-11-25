import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import AboutMeManager from "./AdminManager/AboutMeManager";
import ProjectManager from "./AdminManager/ProjectManager";
import { useApiClients } from "../../Api/useApiClients";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const AdminPage = () => {
  const { loginApi, portfolioApi } = useApiClients();
  const { showPopup } = usePopup();

  const [aboutMeData, setAboutMeData] = useState(null);
  const [projectsData, setProjectsData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await portfolioApi.get("/portfolio/getAboutMe");
      if (res.data.status === "0") {
        setAboutMeData(res.data?.aboutMe || null);
        setProjectsData(res.data?.projects || []);
      } else {
        showPopup(res.data.message || "Failed to load data", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Network error while loading portfolio data.";
      showPopup(msg, "error");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await loginApi.post("/auth/logout");

      if (res.data.status === "0") {
        showPopup(res.data.message || "Logged out successfully", "success");
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        showPopup(res.data.message || "Logout failed", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Network error while logging out.";
      showPopup(msg, "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <AboutMeManager initialData={aboutMeData} onRefresh={fetchData} />
      <ProjectManager initialProjects={projectsData} onRefresh={fetchData} />
    </div>
  );
};

export default AdminPage;
