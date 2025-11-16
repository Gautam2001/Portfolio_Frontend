import React from "react";
import "./Home.css";
import Header from "../1_Header/Header";

const Home = ({ home }) => {
  if (!home) return null;

  return (
    <div className="home-container">
      <div className="home-left">
        <div className="top-line"></div>
        <h1 className="home-name">I'm {home.name},</h1>
        <h1 className="home-name">a Software Developer</h1>
        {home.oneLiner && <h2 className="home-oneliner">{home.oneLiner}</h2>}
        <div className="socials">
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            className="linkedin"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/your-profile"
            target="_blank"
            className="github"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="mailto:your@email.com" className="email">
            <i className="fa-solid fa-envelope"></i>
          </a>
          <a href="tel:+91xxxxxxxxxx" className="phone">
            <i className="fa-solid fa-phone"></i>
          </a>
        </div>
      </div>
      <div className="home-center">
        {home.image?.url && (
          <img
            src={home.image.url}
            alt={home.image.description || "Profile"}
            className="home-image"
          />
        )}
      </div>

      <div className="home-right">
        <h3>About Me</h3>{" "}
        <p>
          {home.description} Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Adipisci excepturi, commodi consequuntur ipsa ad temporibus
          doloribus laborum tenetur pariatur iure nemo recusandae saepe aliquam
          ullam minus deleniti vero porro iste blanditiis esse quae alias
          voluptas nam. Iusto, culpa exercitationem nam quod debitis laudantium
          id repellat inventore minima, provident excepturi quasi!
        </p>
      </div>
    </div>
  );
};

export default Home;
