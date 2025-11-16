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

const MainPage = () => {
  const { showPopup } = usePopup();
  const { portfolioApi } = useApiClients();
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  // Fetch API data one time
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
    fetchPortfolioData();
  }, []);

  const sectionComponents = {
    Home: <Home />,
    Experience: <Experience />,
    Education: <Education />,
    Skills: <Skills />,
    Projects: <Projects />,
    Certificates: <Certificates />,
    Contact: <ContactUs />,
  };

  return (
    <div className="mp-window" ref={scrollContainerRef}>
      {/* If still loading, show loader */}
      {loading && <div className="mp-loading">Loading Portfolio...</div>}

      {/* Show Home section */}
      {portfolioData?.sections?.includes("Home") && (
        <section id="home" className="full-section">
          <Home home={portfolioData.home} />
        </section>
      )}

      {/* Show Header section sticky scroll */}
      {portfolioData && <Header sections={portfolioData.sections} />}

      {/* Show other Sections */}
      {portfolioData &&
        portfolioData.sections
          .filter((sec) => sec !== "Home")
          .map((sec) => {
            // normalize the id
            const sectionId = sec.toLowerCase().replace(/\s+/g, "");
            return (
              <section
                key={sec}
                id={sectionId}
                className={sec === "Skills" ? "half-section" : "full-section"}
              >
                {sectionComponents[sec]}
              </section>
            );
          })}
    </div>
  );
};

export default MainPage;
