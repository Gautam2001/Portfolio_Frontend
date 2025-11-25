import React, { useState, useRef } from "react";
import { useApiClients } from "../../../Api/useApiClients";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import "./AboutMeManager.css";

const AboutMeManager = ({ initialData, onRefresh }) => {
  const { portfolioApi } = useApiClients();
  const { showPopup } = usePopup();

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/json") {
      showPopup("Only JSON files are allowed", "error");
      e.target.value = "";
      return;
    }

    try {
      const text = await selected.text();
      JSON.parse(text);
      setFile(selected);
    } catch {
      showPopup("Invalid JSON file", "error");
      e.target.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showPopup("Select a valid JSON file first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("aboutMe", file);

    try {
      const res = await portfolioApi.post(
        "/admin-portfolio/aboutMeUpload",
        formData
      );
      if (res.data.status === "0") {
        showPopup(
          res.data.message || "About Me uploaded successfully",
          "success"
        );
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRefresh?.(); // trigger parent refresh
      } else {
        showPopup(res.data.message || "Upload failed", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Network error, please try again.";
      showPopup(msg, "error");
    }
  };

  const handleDownload = () => {
    if (!initialData) return;

    const jsonStr = JSON.stringify(initialData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "aboutMe.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-section">
      <h2>About Me Manager</h2>

      <div className="file-upload-container">
        <label className={`file-upload-label ${file ? "file-selected" : ""}`}>
          {file ? file.name : "Choose JSON file or drag it here"}
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
        <button className="upload-btn" onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </div>

      <div className="download-container">
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={!initialData}
        >
          {initialData ? "Download Existing About Me" : "No Data Available"}
        </button>
      </div>
    </div>
  );
};

export default AboutMeManager;
