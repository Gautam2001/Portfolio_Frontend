import React from "react";
import "./Header.css";

const Header = ({ sections }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const scrollContainer = document.querySelector(".mp-window");

    if (section && scrollContainer) {
      const headerOffset = window.innerWidth <= 768 ? 100 : 30;
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
