import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProjectPage.css";
import { useApiClients } from "../../Api/useApiClients";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const ProjectPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const projectId = state?.id;

  const { portfolioApi } = useApiClients();
  const { showPopup } = usePopup();

  const [project, setProject] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleBack = () => navigate("/", { state: { scrollToProjects: true } });

  const fetchProject = async () => {
    try {
      const res = await portfolioApi.post("/portfolio/getProjectById", {
        id: projectId,
      });

      if (res.data.status === "0") {
        setProject(res.data.project);
      } else {
        showPopup(res.data.message || "Failed to load project", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Network error while loading project details.";
      showPopup(msg, "error");
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  if (!project) return <div className="project-loading">Loading...</div>;

  const { detail } = project;

  const screenshots = detail?.screenshots || [];
  const totalScreens = screenshots.length;

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % totalScreens);

  const prevSlide = () =>
    setCarouselIndex((prev) => (prev - 1 + totalScreens) % totalScreens);

  return (
    <div className="project-page">
      {/* BACK BUTTON TOP */}
      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button>

      {/* HERO */}
      <div className="project-hero">
        {project.titleImage?.url && (
          <img
            src={project.titleImage.url}
            alt={project.titleImage.name}
            className="hero-img"
          />
        )}

        <div className="hero-content">
          <h1 className="hero-title">{project.title}</h1>
          <p className="hero-desc">{project.shortDesc}</p>

          <div className="hero-links">
            {project.links?.map((link, idx) => (
              <a
                key={idx}
                className="btn-link"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      {detail?.overview && (
        <section className="section">
          <h2 className="section-heading">Overview</h2>
          {detail.overview.map((para, idx) => (
            <p key={idx} className="section-text">
              {para}
            </p>
          ))}
        </section>
      )}

      {/* FEATURES */}
      {detail?.keyFeatures && (
        <section className="section">
          <h2 className="section-heading">Key Features</h2>
          <ul className="feature-list">
            {detail.keyFeatures.map((feature, idx) => (
              <li key={idx} className="feature-item">
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TECH STACK */}
      {detail?.techStack && (
        <section className="section">
          <h2 className="section-heading">Tech Stack</h2>
          <ul className="tech-list">
            {detail.techStack.map((tech, idx) => (
              <li key={idx} className="tech-item">
                {tech}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ENGINEERING HIGHLIGHT */}
      {detail?.engineeringHighlight && (
        <section className="section">
          <h2 className="section-heading">Engineering Highlight</h2>
          <p className="section-text">{detail.engineeringHighlight}</p>
        </section>
      )}

      {/* DEMO SECTION */}
      {(detail?.video || totalScreens > 0) && (
        <section className="section video-gallery-section">
          <h2 className="section-heading">Demo</h2>

          {/* CASE 1 — VIDEO + IMAGES */}
          {detail.video && totalScreens > 0 && (
            <div className="video-gallery-container">
              {/* VIDEO */}
              <div className="video-panel">
                <div className="aspect-16-9">
                  <video src={detail.video.url} controls />
                </div>

                {detail.video.description && (
                  <p className="video-desc">{detail.video.description}</p>
                )}
              </div>

              {/* CAROUSEL */}
              <div className="carousel-panel">
                <button className="carousel-btn" onClick={prevSlide}>
                  ‹
                </button>

                <div className="single-img-wrapper">
                  <div className="aspect-16-9">
                    <img
                      src={screenshots[carouselIndex].url}
                      alt={screenshots[carouselIndex].name}
                    />
                  </div>

                  {screenshots[carouselIndex].description && (
                    <p className="video-desc">
                      {screenshots[carouselIndex].description}
                    </p>
                  )}
                </div>

                <button className="carousel-btn" onClick={nextSlide}>
                  ›
                </button>
              </div>
            </div>
          )}

          {/* CASE 2 — ONLY VIDEO */}
          {detail.video && totalScreens === 0 && (
            <div className="video-only">
              <div className="aspect-16-9">
                <video src={detail.video.url} controls />
              </div>

              {detail.video.description && (
                <p className="video-desc">{detail.video.description}</p>
              )}
            </div>
          )}

          {/* CASE 3 — ONLY IMAGES (2 at a time) */}
          {!detail.video && totalScreens > 0 && (
            <div className="carousel-only">
              {totalScreens > 1 && (
                <button className="carousel-btn" onClick={prevSlide}>
                  ‹
                </button>
              )}

              <div className="double-img-wrapper">
                <div className="aspect-16-9">
                  <img
                    src={screenshots[carouselIndex].url}
                    alt={screenshots[carouselIndex].name}
                  />
                </div>

                {totalScreens > 1 && (
                  <div className="aspect-16-9">
                    <img
                      src={screenshots[(carouselIndex + 1) % totalScreens].url}
                      alt={screenshots[(carouselIndex + 1) % totalScreens].name}
                    />
                  </div>
                )}
              </div>

              {totalScreens > 1 && (
                <button className="carousel-btn" onClick={nextSlide}>
                  ›
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* TABLE DETAILS */}
      {detail?.tables?.length > 0 && (
        <section className="section">
          <h2 className="section-heading">Data Models</h2>

          {detail.tables.map((tbl, idx) => (
            <div key={idx} className="table-card">
              <h3 className="table-title">{tbl.name}</h3>
              <p className="table-desc">{tbl.description}</p>

              {/* Display columns as pills */}
              <div className="columns-list">
                {tbl.columns.map((col, cIdx) => (
                  <span key={cIdx} className="column-pill">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* API DETAILS */}
      {detail?.apis?.length > 0 && (
        <section className="section">
          <h2 className="section-heading">API Endpoints</h2>
          <div className="api-table-wrapper">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Purpose</th>
                  <th>Auth</th>
                </tr>
              </thead>
              <tbody>
                {detail.apis.map((api, idx) => (
                  <tr key={idx}>
                    <td>{api.endpoint}</td>
                    <td>{api.method}</td>
                    <td>{api.purpose}</td>
                    <td>{api.auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* LINKS BOTTOM */}
      {project.links && (
        <section className="section bottom-links">
          <h2 className="section-heading">Links</h2>
          <div className="hero-links">
            {project.links.map((link, idx) => (
              <a
                key={idx}
                className="btn-link"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <button className="back-btn bottom" onClick={handleBack}>
        ← Back
      </button>
    </div>
  );
};

export default ProjectPage;
