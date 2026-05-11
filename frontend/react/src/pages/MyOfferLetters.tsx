import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../features/offer-letter/styles/Results.css";
import { toast } from "react-toastify";
import { authFetch } from "../api/authFetch";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type OfferLetter = {
  id: number;
  candidate_name: string;
  file_name: string;
  created_at: string;
};

const MyOfferLetters: React.FC = () => {
  const [files, setFiles] = useState<OfferLetter[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await authFetch(`${API_URL}/my-offerletters`, {
          method: "GET",
        });

        if (!res.ok) {
          const errData = await res.json();
          toast.error(errData.detail || "Unable to load offer letters");
          return;
        }

        const data = await res.json();
        setFiles(data || []);
      } catch (err: any) {
        if (err.message === "Session expired") {
          return; 
        }
        toast.error(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  const handleDownload = async (offerId: number, filename: string) => {
    try {
      const res = await authFetch(`${API_URL}/download/${offerId}`, {
        method: "GET",
      });

      if (!res.ok) {
        toast.error("Download failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="full-container">
        <div className="loader-container">
          <div className="loader-box">
            <div className="spinner"></div>
            <p>Loading your offer letters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!files.length) {
    return (
      <div className="full-container">
        <div className="empty-container">
          <div className="empty-box">
            <h3>No Offer Letters Found</h3>
            <p>You have not generated any offer letters yet.</p>

            <button className="button" onClick={() => navigate("/")}>
              Generate Offer Letter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="full-container">
      <div className="results-header">
        <button className="back-arrow2" onClick={() => navigate("/")}>
          ←
        </button>
        <h2>My Offer Letters</h2>
      </div>

      <div className="scroll-area">
        {files.map((file) => (
          <div key={file.id} className="results-item">
            <span>{file.candidate_name}</span>

            <button
              className="download-btn"
              onClick={() => handleDownload(file.id, file.file_name)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOfferLetters;