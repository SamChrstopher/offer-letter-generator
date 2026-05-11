import React from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, FormInput } from "lucide-react";
import "../../src/features/offer-letter/styles/Selection.css"

const Selection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="selection-wrapper">
      <div className="selection-container">
        <div className="selection-header">
          <h1>Generate Offer Letters</h1>
          <p className="selection-subtitle">Choose your preferred method to create professional offer letters</p>
        </div>
        
        <div className="selection-cards">
          <div className="selection-card" onClick={() => navigate("/form")}>
            <div className="card-icon form-icon">
              <FormInput size={48} />
            </div>
            <h3>Form Based</h3>
            <p>Fill out a detailed form with all candidate information manually</p>
            <div className="card-footer">
              <span className="card-action">Get Started →</span>
            </div>
          </div>

          <div className="selection-card" onClick={() => navigate("/excel")}>
            <div className="card-icon excel-icon">
              <FileSpreadsheet size={48} />
            </div>
            <h3>Excel Upload</h3>
            <p>Upload an Excel file with multiple candidates for bulk generation</p>
            <div className="card-footer">
              <span className="card-action">Get Started →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;