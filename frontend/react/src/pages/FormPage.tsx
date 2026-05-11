import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GenerateButton from "../features/offer-letter/components/GenerateButton";
import StatusMessage from "../features/offer-letter/components/StatusMessage";
import { useOfferLetter } from "../features/offer-letter/hooks/useOfferLetter";
import "../features/offer-letter/styles/FormPage.css";
import NavigateToSelection from "../features/offer-letter/components/NavigateToSelection";

const BONUS_FIELDS = [
  { key: "joining_bonus", label: "Joining Bonus" },
  { key: "retention bonus 6 months", label: "Retention Bonus - 6 Months" },
  { key: "retention bonus 12 months", label: "Retention Bonus - 12 Months" },
  { key: "one_time_bonus", label: "One Time Bonus" },
  { key: "variable_pay", label: "Variable Pay" },
  { key: "notice_period_buyout", label: "Notice Period Buy Out" },
  { key: "relocation", label: "Relocation Allowance" },
  { key: "revised_ctc", label: "Revised CTC" },
];

const formatDateWithSuffix = (dateStr: string) => {
  if (!dateStr) return "";

  const [dayStr, monthStr, year] = dateStr.split("-");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getSuffix = (d: number) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${getSuffix(day)} ${months[month]} ${year}`;
};
const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { status, error, generateFromForm } = useOfferLetter();
  const isLoading = status === "loading";

  const [rawDate, setRawDate] = useState("");

  const [formData, setFormData] = useState({
    candidate_name: "",
    doc_no: "",
    doj: "",
    joining_location: "",
    address: "",
    proposed_designation: "",
    reporting_manager: "",
    proposed_ctc: "",
    joining_bonus: "",
    "retention bonus 6 months": "",
    "retention bonus 12 months": "",
    retention_bonus: "",
    one_time_bonus: "",
    variable_pay: "",
    notice_period_buyout: "",
    relocation: "",
    relocation_from: "",
    relocation_to: "",
    revised_ctc: "",
  });

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericFields = [
      "proposed_ctc",
      "revised_ctc",
      "joining_bonus",
      "retention bonus 6 months",
      "retention bonus 12 months",
      "one_time_bonus",
      "variable_pay",
      "notice_period_buyout",
      "relocation",
    ];

    const textFields = [
      "candidate_name",
      "joining_location",
      "reporting_manager",
      "relocation_from",
      "relocation_to",
    ];

    let errorMsg = "";
    let finalValue = value;

    if (name === "doc_no" && !/^[0-9]*$/.test(value)) {
      errorMsg = "Only numbers allowed";
    }

    if (numericFields.includes(name)) {
      const cleaned = value.replace(/,/g, "");
      if (!/^[0-9]*$/.test(cleaned)) {
        errorMsg = "Only numbers allowed";
      } else {
        finalValue = cleaned ? Number(cleaned).toLocaleString("en-IN") : "";
      }
    }

    if (textFields.includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        errorMsg = "Only alphabets allowed";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const toggleOption = (key: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeFields = useMemo(
    () => BONUS_FIELDS.filter((f) => selected[f.key]),
    [selected]
  );

  const validateRequired = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidate_name) newErrors.candidate_name = "Name is required";
    if (!formData.proposed_ctc) newErrors.proposed_ctc = "CTC is required";
    if (!formData.joining_location) newErrors.joining_location = "Location is required";
    if (!formData.proposed_designation) newErrors.proposed_designation = "Designation is required";
    if (!formData.reporting_manager) newErrors.reporting_manager = "Manager is required";
    if (!formData.doc_no) newErrors.doc_no = "Document Number is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateRequired()) return;

    const hasErrors = Object.values(errors).some((e) => e);
    if (hasErrors) return;

    const cleanedData = {
      ...formData,
      DocNo: formData.doc_no || "DOC001",
       // 👇 ADD THIS LINE
      // 👇 SHORT FORMAT (for top Date)
  DOJ: formData.doj,

  // 👇 LONG FORMAT (for paragraph)
  DOJ_LONG: formatDateWithSuffix(formData.doj),
      ...Object.fromEntries(
        Object.keys(selected).map((key) => [
          key,
          selected[key] ? formData[key as keyof typeof formData] : "",
        ])
      ),
    };

    const result = await generateFromForm(cleanedData);

    if (result?.length) {
      navigate("/results", { state: { files: result } });
    }
  };

  return (
    <div className="form-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h4 className="sidebar-title">Compensation Components</h4>
          <p className="sidebar-subtitle">Select additional components to include</p>
        </div>

        <div className="sidebar-items">
          {BONUS_FIELDS.map((item) => (
            <label
              key={item.key}
              className={`sidebar-item ${selected[item.key] ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={!!selected[item.key]}
                onChange={() => toggleOption(item.key)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="form-content">
        <NavigateToSelection />
        
        <div className="form-container">
          <div className="form-header">
            <h2>Candidate Information</h2>
            <p className="form-subtitle">Enter the required details to generate an offer letter</p>
          </div>

          <div className="form-card">
            <div className="form-section">
              <h3 className="section-title">Basic Details</h3>
              
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Full Name <span className="required">*</span></label>
                  <input
                    name="candidate_name"
                    value={formData.candidate_name}
                    placeholder="Enter full name"
                    onChange={handleChange}
                    className={`form-input ${errors.candidate_name ? "error" : ""}`}
                  />
                  {errors.candidate_name && <p className="error-text">{errors.candidate_name}</p>}
                </div>

                <div className="form-field">
                  <label className="field-label">Document Number <span className="required">*</span></label>
                  <input
                    name="doc_no"
                    value={formData.doc_no}
                    placeholder="Enter document number"
                    onChange={handleChange}
                    className={`form-input ${errors.doc_no ? "error" : ""}`}
                  />
                  {errors.doc_no && <p className="error-text">{errors.doc_no}</p>}
                </div>

                <div className="form-field">
                  <label className="field-label">Date of Joining</label>
                  <input
                    type={rawDate ? "date" : "text"}
                    name="doj"
                    placeholder="Select date"
                    value={rawDate}
                    min={new Date().toISOString().split("T")[0]}
                    onFocus={(e) => { e.target.type = "date"; }}
                    onBlur={(e) => { if (!rawDate) e.target.type = "text"; }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRawDate(value);
                      if (value) {
                        const [year, month, day] = value.split("-");
                        const formatted = `${day}-${month}-${year}`;
                        setFormData((prev) => ({ ...prev, doj: formatted }));
                      }
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Location <span className="required">*</span></label>
                  <input
                    name="joining_location"
                    value={formData.joining_location}
                    placeholder="Enter location"
                    onChange={handleChange}
                    className={`form-input ${errors.joining_location ? "error" : ""}`}
                  />
                  {errors.joining_location && <p className="error-text">{errors.joining_location}</p>}
                </div>

                <div className="form-field full-width">
                  <label className="field-label">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    placeholder="Enter address"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Designation <span className="required">*</span></label>
                  <input
                    name="proposed_designation"
                    placeholder="Enter designation"
                    onChange={handleChange}
                    className={`form-input ${errors.proposed_designation ? "error" : ""}`}
                  />
                  {errors.proposed_designation && <p className="error-text">{errors.proposed_designation}</p>}
                </div>

                <div className="form-field">
                  <label className="field-label">Reporting Manager <span className="required">*</span></label>
                  <input
                    name="reporting_manager"
                    value={formData.reporting_manager}
                    placeholder="Enter manager name"
                    onChange={handleChange}
                    className={`form-input ${errors.reporting_manager ? "error" : ""}`}
                  />
                  {errors.reporting_manager && <p className="error-text">{errors.reporting_manager}</p>}
                </div>

                <div className="form-field">
                  <label className="field-label">Proposed CTC (₹) <span className="required">*</span></label>
                  <input
                    name="proposed_ctc"
                    value={formData.proposed_ctc}
                    placeholder="Enter CTC amount"
                    onChange={handleChange}
                    className={`form-input ${errors.proposed_ctc ? "error" : ""}`}
                  />
                  {errors.proposed_ctc && <p className="error-text">{errors.proposed_ctc}</p>}
                </div>
              </div>
            </div>

            {activeFields.length > 0 && (
              <div className="form-section">
                <h3 className="section-title">Additional Compensation</h3>
                
                <div className="form-grid">
                  {activeFields.map((field) => (
                    <div key={field.key} className="form-field">
                      <label className="field-label">{field.label}</label>
                      <input
                        name={field.key}
                        value={formData[field.key as keyof typeof formData] || ""}
                        placeholder={`Enter amount`}
                        onChange={handleChange}
                        className={`form-input ${errors[field.key] ? "error" : ""}`}
                      />
                      {errors[field.key] && <p className="error-text">{errors[field.key]}</p>}

                      {field.key === "relocation" && (
                        <div className="relocation-group">
                          <input
                            name="relocation_from"
                            placeholder="From"
                            onChange={handleChange}
                            className="form-input relocation-input"
                          />
                          <input
                            name="relocation_to"
                            placeholder="To"
                            onChange={handleChange}
                            className="form-input relocation-input"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <GenerateButton
                onGenerate={handleGenerate}
                loading={isLoading}
                disabled={!formData.candidate_name || !formData.proposed_ctc}
              />
              <StatusMessage status={status} error={error} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;