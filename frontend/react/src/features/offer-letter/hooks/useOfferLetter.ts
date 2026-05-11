import { useState, useCallback } from "react";
import { type OfferLetterState } from "../types/offerLetter.types";
import { uploadExcel, generateLetters, generateFromFormApi } from "../../../api/offerLetter";

const initialState: OfferLetterState = {
  file: null,
  docNo: "",
  status: "idle",
  error: null,
  files: [],
};

export const useOfferLetter = () => {
  const [state, setState] = useState<OfferLetterState>(initialState);

  const setFile = useCallback((file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      setState((prev) => ({
        ...prev,
        error: "Only .xlsx files are allowed",
        file: null,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      file,
      error: null,
      status: "idle",
      files: [],
    }));
  }, []);

  const setDocNo = useCallback((docNo: string) => {
    setState((prev) => ({
      ...prev,
      docNo: docNo.trim(),
    }));
  }, []);

  const generateOfferLetters = useCallback(async () => {
    if (!state.file) {
      setState((prev) => ({
        ...prev,
        error: "Please upload Excel file",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      // Upload Excel
      const uploadData = await uploadExcel(state.file);

      // Generate offer letters
      const data = await generateLetters(uploadData.file_id);

      setState((prev) => ({
        ...prev,
        status: "success",
        files: data.results,
      }));

      return data.results;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err.message || "Something went wrong",
      }));
    }
  }, [state.file]);

  const generateFromForm = useCallback(async (formData: any) => {
    setState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      const data = await generateFromFormApi(formData);

      setState((prev) => ({
        ...prev,
        status: "success",
        files: data.results,
      }));

      return data.results;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err.message || "Something went wrong",
      }));
    }
  }, []);

  return {
    ...state,
    setFile,
    setDocNo,
    generateOfferLetters,
    generateFromForm,
  };
};