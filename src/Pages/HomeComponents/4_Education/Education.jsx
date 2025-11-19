import React from "react";
import "./Education.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Education = ({ education }) => {
  if (!education || !education.length) return null;

  return (
    <div className="ed-container">
      <SectionHeading title="Education" />
      <div className="ed-window">
        <div className="ed-timeline">
          {education.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div className="ed-timeline-item" key={index}>
                {/* LEFT SIDE */}
                <div className="ed-side left-side">
                  {isLeft ? (
                    <div className="ed-desc-card">
                      <h3 className="ed-position">{item.position}</h3>
                      <h4 className="ed-institute">{item.name}</h4>
                      <p className="ed-description">{item.description}</p>
                    </div>
                  ) : (
                    <div className="ed-year-left">{item.year}</div>
                  )}
                </div>

                {/* CENTER SPINE */}
                <div className="ed-center-line">
                  <div className="ed-circle">
                    <img src={item.logo.url} alt={item.logo.name} />
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="ed-side right-side">
                  {!isLeft ? (
                    <div className="ed-desc-card">
                      <h3 className="ed-position">{item.position}</h3>
                      <h4 className="ed-institute">{item.name}</h4>
                      <p className="ed-description">{item.description}</p>
                    </div>
                  ) : (
                    <div className="ed-year-right">{item.year}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Education;
