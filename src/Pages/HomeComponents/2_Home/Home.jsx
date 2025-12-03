import React, { useEffect, useRef } from "react";
import "./Home.css";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
  FaPhone,
} from "react-icons/fa";

// Map the contact names to icons
const iconMap = {
  Email: <FaEnvelope />,
  GitHub: <FaGithub />,
  LinkedIn: <FaLinkedin />,
  Resume: <FaFileDownload />,
  Phone: <FaPhone />,
};

const Home = ({ home, contact }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
          else entry.target.classList.remove("visible");
        });
      },
      { threshold: 0.2 }
    );

    const elems = containerRef.current.querySelectorAll(".home-animate");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!home) return null;

  return (
    <div className="home-container" ref={containerRef}>
      {/* LEFT */}
      <div className="home-left home-animate" style={{ "--delay": "0s" }}>
        <div className="top-line"></div>
        <h1 className="home-name">I'm {home.name},</h1>
        <h1 className="home-name">a Software Developer</h1>
        {home.oneLiner && <h2 className="home-oneliner">{home.oneLiner}</h2>}

        <div className="socials">
          {contact &&
            contact.map((c, idx) => (
              <a
                key={idx}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                {iconMap[c.name] || <FaEnvelope />}
              </a>
            ))}
        </div>
      </div>

      {/* CENTER */}
      <div className="home-center home-animate" style={{ "--delay": "0.2s" }}>
        {home.image?.url && (
          <img
            src={home.image.url}
            alt={home.image.description || "Profile"}
            className="home-image"
          />
        )}
      </div>

      {/* RIGHT */}
      <div className="home-right home-animate" style={{ "--delay": "0.4s" }}>
        <h3>About Me</h3>
        <p>{home.description}</p>
      </div>
    </div>
  );
};

export default Home;
