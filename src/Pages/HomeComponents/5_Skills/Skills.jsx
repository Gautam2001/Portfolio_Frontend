import React from "react";
import "./Skills.css";
import SectionHeading from "../SectionHeading/SectionHeading";

const Skills = ({ skills }) => {
  if (!skills || !skills.length) return null;

  return (
    <div className="sk-window">
      <SectionHeading title="Skills" />
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div className="skill-pill" key={index}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
