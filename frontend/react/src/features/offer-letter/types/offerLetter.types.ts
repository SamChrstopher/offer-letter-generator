export type UploadStatus = "idle" | "loading" | "success" | "error";

export type GeneratedFile = {
  offer_id: number;
  candidate_name: string;
  file_name: string;
  doc_no?: string;
  created_at?: string;
};

export interface OfferLetterState {
  file: File | null;
  docNo:string
  status: UploadStatus;
  error: string | null;
  files: GeneratedFile[];
}