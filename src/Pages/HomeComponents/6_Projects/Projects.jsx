import React, { useEffect, useRef } from "react";
import "./Projects.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Projects = ({ projects }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = containerRef.current.querySelectorAll(".pr-animate");
    cards.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pr-window" ref={containerRef}>
      <div className="pr-container">
        <SectionHeading title="Projects" />
        <div className="pr-grid">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="pr-card pr-animate"
              style={{ "--delay": `${idx * 0.2}s` }}
            >
              <div className="pr-card-front">
                <img
                  src={project.titleImage.url}
                  alt={project.title}
                  className="pr-card-image"
                />
                <div className="pr-card-title-overlay">{project.title}</div>
              </div>

              <div className="pr-card-back">
                <p className="pr-card-desc">{project.shortDesc}</p>
                <div className="pr-card-links">
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pr-card-link"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
