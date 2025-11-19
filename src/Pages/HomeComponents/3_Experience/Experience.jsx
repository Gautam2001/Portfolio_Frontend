import React from "react";
import "./Experience.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Experience = ({ experience }) => {
  if (!experience || !experience.length) return null;

  const perRow = 3; // nodes per row
  const rows = [];

  for (let i = 0; i < experience.length; i += perRow) {
    const row = experience.slice(i, i + perRow);
    rows.push(row);
  }

  return (
    <div className="ex-container">
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
                <div className="ex-node-wrapper" key={item.id}>
                  <div className="ex-node">
                    <img src={item.logo.url} alt={item.logo.name} />
                  </div>
                  <div className="ex-card">
                    <span className="ex-year">{item.year}</span>
                    <h3 className="ex-position">{item.position}</h3>
                    <h4 className="ex-company">{item.name}</h4>
                    <p className="ex-description">{item.description}</p>
                  </div>

                  {/* vertical connector to next row */}
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
