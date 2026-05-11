import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/NavigateToSelection.css";

const NavigateToSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="back-arrow"
      onClick={() => navigate("/")}
      title="Back"
    >
      <ArrowLeft size={22} />
    </div>
  );
};

export default NavigateToSelection;