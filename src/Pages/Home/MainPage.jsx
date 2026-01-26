import React, { useEffect, useRef, useState } from "react";
import Home from "../HomeComponents/2_Home/Home";
import Education from "../HomeComponents/4_Education/Education";
import Experience from "../HomeComponents/3_Experience/Experience";
import Header from "../HomeComponents/1_Header/Header";
import "./MainPage.css";
import Skills from "../HomeComponents/5_Skills/Skills";
import Projects from "../HomeComponents/6_Projects/Projects";
import Certificates from "../HomeComponents/7_Certificates/Certificates";
import ContactUs from "../HomeComponents/8_Contact/Contact";
import { useApiClients } from "../../Api/useApiClients";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLocation, useNavigate } from "react-router-dom";

import fallbackData from "../../utils/Portfolio.json";
import { setBackendDown } from "../../utils/backendStatus";

const MainPage = () => {
  const { showPopup } = usePopup();
  const { portfolioApi, loginApi } = useApiClients();
  const scrollContainerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  const { state, key } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.scrollToProjects && portfolioData) {
      // Delay to allow DOM to render
      setTimeout(() => {
        const section = document.getElementById("projects");
        const scrollContainer = scrollContainerRef.current;
        const headerOffset = 30;

        if (section && scrollContainer) {
          scrollContainer.scrollTo({
            top: section.offsetTop - headerOffset,
            behavior: "smooth",
          });
          navigate(window.location.pathname, { replace: true, state: {} });
        }
      }, 250);
    }
  }, [state, key, portfolioData, navigate]);

  const pingAuthAPI = async () => {
    try {
        const authRes = await loginApi.get("/auth/ping");
        console.log("Auth Ping Response:", authRes.data);
      } catch (err) {
        console.error("Admin portal down...", err);
      }
  };
  
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const res = await portfolioApi.get("/portfolio/getAboutMe");

      if (res.data.status === "0") {
        setPortfolioData({
          home: res.data.aboutMe.myData,
          sections: res.data.aboutMe.sections,
          experience: res.data.aboutMe.experience,
          education: res.data.aboutMe.education,
          skills: res.data.aboutMe.skills,
          certificates: res.data.aboutMe.certificates,
          contact: res.data.aboutMe.contact,
          projects: res.data.projects,
        });
      } else {
        showPopup(res.data.message || "Failed to load data", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Network error while loading portfolio data.";
      showPopup(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage.clear();

    const init = async () => {
      setLoading(true);

      try {
        await portfolioApi.get("/portfolio/ping");
        setBackendDown(false);
        await fetchPortfolioData();
        await pingAuthAPI();
      } catch {
        console.warn("Backend down, loading fallback data");
        setBackendDown(true);

        setPortfolioData({
          home: fallbackData.aboutMe.myData,
          sections: fallbackData.aboutMe.sections,
          experience: fallbackData.aboutMe.experience,
          education: fallbackData.aboutMe.education,
          skills: fallbackData.aboutMe.skills,
          certificates: fallbackData.aboutMe.certificates,
          contact: fallbackData.aboutMe.contact,
          projects: fallbackData.projects,
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading || !portfolioData) {
    return <div className="mp-loading">Loading Portfolio...</div>;
  }

  const sectionComponents = {
    Home: <Home home={portfolioData.home} contact={portfolioData.contact} />,
    Experience: <Experience experience={portfolioData.experience} />,
    Education: <Education education={portfolioData.education} />,
    Skills: <Skills skills={portfolioData.skills} />,
    Projects: <Projects projects={portfolioData.projects} />,
    Certificates: <Certificates certificates={portfolioData.certificates} />,
    Contact: <ContactUs contact={portfolioData.contact} />,
  };

  return (
    <div className="mp-window" ref={scrollContainerRef}>
      {/* Home Section */}
      {portfolioData.sections.includes("Home") && (
        <section id="home" className="full-section">
          {sectionComponents["Home"]}
        </section>
      )}

      {/* Sticky Header */}
      <Header sections={portfolioData.sections} />

      {/* All Other Sections */}
      {portfolioData.sections
        .filter((sec) => sec !== "Home")
        .map((sec) => {
          const sectionId = sec.toLowerCase().replace(/\s+/g, "");
          return (
            <section key={sec} id={sectionId} className="section-block">
              {sectionComponents[sec]}
            </section>
          );
        })}
    </div>
  );
};

export default MainPage;
