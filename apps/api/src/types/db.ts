export interface Entity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  external_reference?: string;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  format: 'docx' | 'html';
  placeholders: string[];
  storage_path: string;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface DocumentRecord {
  id: string;
  entity_id: string;
  template_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  doc_service_job_id?: string;
  generated_file_path?: string;
  generated_file_url?: string;
  payload: Record<string, unknown>;
  error?: unknown;
  requested_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}
