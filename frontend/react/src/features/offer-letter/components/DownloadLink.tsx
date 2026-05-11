// import React from "react";
// import { type GeneratedFile } from "../types/offerLetter.types";
// import '../styles/DownloadLink.css'

// interface Props {
//   files: GeneratedFile[];
// }

// const DownloadLink: React.FC<Props> = ({ files }) => {
//   if (!files.length) return null;

//   return (
//     <div>
//       <h4>Download Offer Letters</h4>
//       <ul className="download-list">
//         {files.map((file, index) => (
//           <li key={index}>
//             <a
//               className="download-link"
//               href={`http://localhost:8000/download/${file.filename}`}
//               download
//             >
//               {file.candidate} - Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default React.memo(DownloadLink);

import React from "react";
import { type GeneratedFile } from "../types/offerLetter.types";
import "../styles/DownloadLink.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface Props {
  files: GeneratedFile[];
}

const DownloadLink: React.FC<Props> = ({ files }) => {
  const navigate = useNavigate();

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

  if (!files.length) return null;

  return (
    <div>
      <h4>Download Offer Letters</h4>

      <ul className="download-list">
        {files.map((file, index) => (
          <li key={index}>
            <button
              className="download-link"
              onClick={() => handleDownload(file.offer_id, file.file_name)}
            >
              {file.candidate_name} - Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(DownloadLink);