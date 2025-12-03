import React, { useState, useRef, useEffect } from "react";
import { useApiClients } from "../../../Api/useApiClients";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import "./ProjectManager.css";
import { useNavigate } from "react-router-dom";

const ConfirmDeleteModal = ({ visible, code, onConfirm, onCancel }) => {
  const [input, setInput] = useState("");

  // Whenever the modal becomes invisible → clear the input
  useEffect(() => {
    if (!visible) setInput("");
  }, [visible]);

  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm(input);
    setInput(""); // clear after submit
  };

  const handleCancel = () => {
    onCancel();
    setInput(""); // clear after cancel
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>Confirm Deletion</h3>
        <p>Type the code below to confirm deletion:</p>

        <div className="confirm-code">{code}</div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter code"
        />

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectManager = ({ initialProjects, onRefresh }) => {
  const navigate = useNavigate();
  const { portfolioApi } = useApiClients();
  const { showPopup } = usePopup();

  const [file, setFile] = useState(null);
  const [projectsPreview, setProjectsPreview] = useState(initialProjects || []);
  const fileInputRef = useRef(null);

  // Delete confirmation states
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteAll, setPendingDeleteAll] = useState(false);

  useEffect(() => {
    setProjectsPreview(initialProjects || []);
  }, [initialProjects]);

  // Start delete-confirmation flow
  const startDeleteConfirmation = (projectId = null, deleteAll = false) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // random code
    setConfirmCode(code);
    setConfirmVisible(true);
    setPendingDeleteId(projectId);
    setPendingDeleteAll(deleteAll);
  };

  // Confirmation handler
  const handleConfirm = async (input) => {
    if (input !== confirmCode) {
      showPopup("Incorrect confirmation code", "error");
      return;
    }

    setConfirmVisible(false);

    if (pendingDeleteAll) {
      await deleteAll();
    } else {
      await deleteProject(pendingDeleteId);
    }

    setPendingDeleteId(null);
    setPendingDeleteAll(false);
    setConfirmCode("");
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    setPendingDeleteId(null);
    setPendingDeleteAll(false);
    setConfirmCode("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      showPopup("Choose a project file", "error");
      return;
    }

    const fd = new FormData();
    fd.append("projects", file);

    try {
      const res = await portfolioApi.post(
        "/admin-portfolio/projectsUpload",
        fd
      );

      const data = res.data;

      if (data.status === "0") {
        showPopup(
          `${data.successfulCount} project(s) uploaded successfully!`,
          "success"
        );
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRefresh?.();
      } else if (data.status === "1") {
        const details = data.failedProjects
          ?.map((p) => `${p.title}: ${p.message}`)
          .join("\n");

        showPopup(details || "Upload failed", "error");
      } else {
        showPopup("Unexpected server response", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Network error, please try again.";
      showPopup(msg, "error");
    }
  };

  const downloadProject = async (project) => {
    try {
      const res = await portfolioApi.post(
        "/admin-portfolio/downloadProjectById",
        project.id
      );

      if (res.data.status === "0") {
        const data = res.data.projectListWrapper;
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.title}.json`;
        a.click();

        URL.revokeObjectURL(url);
      } else {
        showPopup(res.data.message || "Download failed", "error");
      }
    } catch {
      showPopup("Network error", "error");
    }
  };

  const downloadAllProjects = async () => {
    try {
      const res = await portfolioApi.get(
        "/admin-portfolio/downloadAllProjects"
      );

      if (res.data.status === "0") {
        const jsonStr = JSON.stringify(res.data.projectListWrapper, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "projects.json";
        a.click();

        URL.revokeObjectURL(url);
      } else {
        showPopup(res.data.message || "Download failed", "error");
      }
    } catch {
      showPopup("Network error", "error");
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await portfolioApi.post(
        "/admin-portfolio/deleteProjectById",
        { id }
      );

      if (res.data.status === "0") {
        showPopup(res.data.message || "Project deleted", "success");
        onRefresh?.();
      } else {
        showPopup(res.data.message || "Delete failed", "error");
      }
    } catch {
      showPopup("Network error", "error");
    }
  };

  const deleteAll = async () => {
    try {
      const res = await portfolioApi.get("/admin-portfolio/deleteAllProjects");

      if (res.data.status === "0") {
        showPopup(res.data.message || "All projects deleted", "success");
        onRefresh?.();
      } else {
        showPopup(res.data.message || "Delete failed", "error");
      }
    } catch {
      showPopup("Network error", "error");
    }
  };

  return (
    <div className="admin-section">
      <h2>Project Manager</h2>

      <div className="file-upload-container">
        <label className={`file-upload-label ${file ? "file-selected" : ""}`}>
          {file ? file.name : "Choose Project file or drag it here"}
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        </label>
        <button className="upload-btn" onClick={handleUpload} disabled={!file}>
          Upload Project
        </button>
      </div>

      <div className="action-buttons">
        <button
          className="download-btn"
          onClick={downloadAllProjects}
          disabled={!projectsPreview.length}
        >
          Download All
        </button>

        <button
          className="delete-btn"
          onClick={() => startDeleteConfirmation(null, true)}
          disabled={!projectsPreview.length}
        >
          Delete All
        </button>
      </div>

      <h3>Existing Projects</h3>

      <div className="projects-list">
        {projectsPreview.map((p) => (
          <div className="project-card" key={p.id}>
            <div
              className="project-info"
              onClick={() => navigate("/project", { state: { id: p.id } })}
              style={{ cursor: "pointer" }}
            >
              <strong>{p.title}</strong>
              <p>{p.shortDesc}</p>
            </div>
            <div className="project-actions">
              <button
                className="download-btn small"
                onClick={() => downloadProject(p)}
              >
                Download
              </button>
              <button
                className="delete-btn small"
                onClick={() => startDeleteConfirmation(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmDeleteModal
        visible={confirmVisible}
        code={confirmCode}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProjectManager;
