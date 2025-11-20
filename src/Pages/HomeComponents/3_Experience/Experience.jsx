import React, { useEffect, useRef } from "react";
import "./Experience.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Experience = ({ experience }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible"); // reset animation
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = containerRef.current.querySelectorAll(".ex-animate");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  if (!experience || !experience.length) return null;

  const perRow = 3;
  const rows = [];

  for (let i = 0; i < experience.length; i += perRow) {
    rows.push(experience.slice(i, i + perRow));
  }

  return (
    <div className="ex-container" ref={containerRef}>
      <SectionHeading title="Experience" />
      <div className="ex-timeline">
        {rows.map((row, rowIndex) => {
          const isOddRow = rowIndex % 2 === 1;

          return (
            <div
              className={`ex-row ${isOddRow ? "reverse-row" : ""}`}
              key={rowIndex}
            >
              <div className="ex-line-horizontal" />
              {row.map((item, idx) => (
                <div
                  className="ex-node-wrapper ex-animate"
                  key={`${rowIndex}-${idx}`}
                  style={{ "--delay": `${idx * 0.2}s` }}
                >
                  <div className="ex-node">
                    <img src={item.logo.url} alt={item.logo.name} />
                  </div>

                  <div className="ex-card">
                    <span className="ex-year">{item.year}</span>
                    <h3 className="ex-position">{item.position}</h3>
                    <h4 className="ex-company">{item.name}</h4>
                    <p className="ex-description">{item.description}</p>
                  </div>

                  {rowIndex < rows.length - 1 &&
                    ((isOddRow && idx === 0) ||
                      (!isOddRow && idx === row.length - 1)) && (
                      <div
                        className={`ex-line-vertical ${
                          isOddRow ? "left" : "right"
                        }`}
                      />
                    )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
