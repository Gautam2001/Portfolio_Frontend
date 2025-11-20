import React, { useEffect, useRef, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import "./Contact.css";
import SectionHeading from "../SectionHeading/SectionHeading";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useApiClients } from "../../../Api/useApiClients";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const { portfolioApi } = useApiClients();
  const { showPopup } = usePopup();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.name.trim())) {
      newErrors.name = "Name must be at least 3 characters and only letters.";
    }

    if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters long.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: integrate your email service / backend API here
    console.log("Form submitted:", form);
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await portfolioApi.post("/portfolio/contactUs", {
        ...form,
      });

      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Thank you, for the Feedback!", "success");
      }
    } catch {
      showPopup("Failed to send feedback. Try again.", "error");
    }
    setForm({ name: "", email: "", message: "" });
  };

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

    const elems = containerRef.current.querySelectorAll(".contact-animate");
    elems.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="contact-page" ref={containerRef}>
      <SectionHeading title="Contact Us" />
      <div className="contact-left contact-animate" style={{ "--delay": "0s" }}>
        <h1>Get in Touch</h1>
        <p>
          I’m always open to discussing new projects, creative ideas, or
          opportunities to be part of your visions.
        </p>
        <div className="contact-socials">
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

      <div
        className="contact-right contact-animate"
        style={{ "--delay": "0.15s" }}
      >
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            required
          />
          {errors.name && <span className="cd-error">{errors.name}</span>}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && <span className="cd-error">{errors.email}</span>}
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className={errors.message ? "error" : ""}
            required
          />
          {errors.message && <span className="cd-error">{errors.message}</span>}
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
