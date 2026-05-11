// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { type GeneratedFile } from "../types/offerLetter.types";
// import "../styles/Results.css";

// const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// const Results: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const files = (location.state as { files: GeneratedFile[] })?.files || [];

//   const handleDownload = async (filename: string) => {
//     try {
//       const token = localStorage.getItem("access_token");

//       if (!token) {
//         alert("Not logged in. Please login again.");
//         navigate("/login");
//         return;
//       }

//       const res = await fetch(`${API_URL}/download/${filename}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         alert(err.detail || "Download failed");
//         return;
//       }

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       alert("Download failed");
//     }
//   };

//   if (!files.length) {
//     return (
//       <div className="full-container">
//         <p>No results found.</p>
//         <button className="button" onClick={() => navigate("/")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="full-container">
//       <div className="results-header">
//         <button className="back-arrow2" onClick={() => navigate("/")}>
//           ←
//         </button>
//         <h2>Generated Offer Letters</h2>
//       </div>

//       <div className="scroll-area">
//         {files.map((file, index) => (
//           <div key={index} className="results-item">
//             <span>{file.candidate}</span>

//             <button
//               className="download-btn"
//               onClick={() => handleDownload(file.filename)}
//             >
//               Download
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Results;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type GeneratedFile } from "../types/offerLetter.types";
import "../styles/Results.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const files = (location.state as { files: GeneratedFile[] })?.files || [];

  const handleDownload = async (offerId: number, filename: string) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Not logged in. Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/download/${offerId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Download failed");
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
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  if (!files.length) {
    return (
      <div className="full-container">
        <p>No results found.</p>
        <button className="button" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="full-container">
      <div className="results-header">
        <button className="back-arrow2" onClick={() => navigate("/")}>
          ←
        </button>
        <h2>Generated Offer Letters</h2>
      </div>

      <div className="scroll-area">
        {files.map((file, index) => (
          <div key={index} className="results-item">
            <span>{file.candidate_name}</span>

            <button
              className="download-btn"
              onClick={() => handleDownload(file.offer_id, file.file_name)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;