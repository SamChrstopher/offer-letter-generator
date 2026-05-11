
import { authFetch } from "./authFetch";

const BASE_URL = "http://localhost:8000";

export const uploadExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Upload failed");
  }

  return data;
};

export const generateLetters = async (fileId: string) => {
  const res = await authFetch(`${BASE_URL}/generate/${fileId}`, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Generation failed");
  }

  return data;
};

export const getMyOfferLetters = async () => {
  const res = await authFetch(`${BASE_URL}/my-offerletters`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch offer letters");
  }

  return data;
};

export const generateFromFormApi = async (formData: any) => {
  const res = await authFetch(`${BASE_URL}/generate-from-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Generate from form failed");
  }

  return data;
};