import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../features/offer-letter/components/FileUpload";
import GenerateButton from "../features/offer-letter/components/GenerateButton";
import StatusMessage from "../features/offer-letter/components/StatusMessage";
import { useOfferLetter } from "../features/offer-letter/hooks/useOfferLetter";
import '../features/offer-letter/styles/Home.css'
import NavigateToSelection from "../features/offer-letter/components/NavigateToSelection";


const Home: React.FC = () => {
  const {
    file,
    status,
    setFile,
    error,
    generateOfferLetters,
  } = useOfferLetter();

  const navigate = useNavigate();
  const isLoading = status === "loading";

  const handleGenerate = async () => {
    const result = await generateOfferLetters();

    if (result?.length) {
      navigate("/results", { state: { files: result } });
    }
  };

  return (
    <div className="home-wrapper">

      <div className="home-container">
        <NavigateToSelection />
        <div className="section">
          <FileUpload
            label="Candidate Details"
            onFileSelect={setFile}
            loading={isLoading}
          />
        </div>

        <div className="section">
          <GenerateButton
            onGenerate={handleGenerate}
            loading={isLoading}
            disabled={!file}
          />
        </div>

        <div className="section">
          <StatusMessage status={status} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Home;
