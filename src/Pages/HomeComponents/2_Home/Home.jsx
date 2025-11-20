import React, { useEffect, useRef } from "react";
import "./Home.css";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";

const Home = ({ home }) => {
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

    const elems = containerRef.current.querySelectorAll(".home-animate");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!home) return null;

  return (
    <div className="home-container" ref={containerRef}>
      <div className="home-left home-animate" style={{ "--delay": "0s" }}>
        <div className="top-line"></div>
        <h1 className="home-name">I'm {home.name},</h1>
        <h1 className="home-name">a Software Developer</h1>
        {home.oneLiner && <h2 className="home-oneliner">{home.oneLiner}</h2>}
        <div className="socials">
          <a
            href="mailto:your@email.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <FaFileDownload />
          </a>
        </div>
      </div>

      <div className="home-center home-animate" style={{ "--delay": "0.20s" }}>
        {home.image?.url && (
          <img
            src={home.image.url}
            alt={home.image.description || "Profile"}
            className="home-image"
          />
        )}
      </div>

      <div className="home-right home-animate" style={{ "--delay": "0.4s" }}>
        <h3>About Me</h3>
        <p>
          {home.description} Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Animi, tempora dignissimos. Aliquid molestias odio dignissimos
          neque dicta mollitia, praesentium tempore aut laboriosam distinctio, a
          dolores fuga! Nihil porro assumenda voluptatibus doloremque eveniet
          ipsam delectus labore, maiores est itaque aut dicta placeat, vitae
          inventore similique nisi eum autem! Quidem, dignissimos fugit!
        </p>
      </div>
    </div>
  );
};

export default Home;
