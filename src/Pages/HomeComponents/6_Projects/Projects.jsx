import React from "react";
import "./Projects.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Projects = ({ projects }) => {
  return (
    <div className="pr-window">
      <div className="pr-container">
        <SectionHeading title="Projects" />
        <div className="pr-grid">
          {projects.map((project) => (
            <div key={project.id} className="pr-card">
              {/* Front Image */}
              <div className="pr-card-front">
                <img
                  src={project.titleImage.url}
                  alt={project.titleImage.description || project.title}
                  className="pr-card-image"
                />
                <div className="pr-card-title-overlay">{project.title}</div>
              </div>

              {/* Hover/Back Layer */}
              <div className="pr-card-back">
                <p className="pr-card-desc">{project.shortDesc}</p>
                <div className="pr-card-links">
                  {project.links.map((link, idx) => (
                    <a
                      key={idx}
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
