import React from "react";
import "./Header.css";

const Header = ({ sections }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const scrollContainer = document.querySelector(".mp-window"); // your scroll container
    const headerOffset = 30; // or the height of your sticky header + extra margin

    if (section && scrollContainer) {
      // get the top relative to container
      const sectionTop = section.offsetTop;
      scrollContainer.scrollTo({
        top: sectionTop - headerOffset,
        behavior: "smooth",
      });
    }
  };

  //Map section names to proper ids if needed
  const getSectionId = (sec) => {
    return sec.toLowerCase();
  };

  return (
    <div className="he">
      {sections.map((sec) => (
        <button key={sec} onClick={() => scrollToSection(getSectionId(sec))}>
          {sec}
        </button>
      ))}
    </div>
  );
};

export default Header;
