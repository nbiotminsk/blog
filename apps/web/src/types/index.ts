export interface Entity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  format: 'docx' | 'html';
  file_path: string;
  file_size: number;
  placeholders: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  entity_id: string;
  template_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generated_file_path?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  entity?: Entity;
  template?: Template;
}

export interface CreateEntityRequest {
  name: string;
  email: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface UpdateEntityRequest {
  name?: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface CreateTemplateRequest {
  name: string;
  format: 'docx' | 'html';
  file: File;
}

export interface GenerateDocumentRequest {
  template_id: string;
  entity_id: string;
  payload: Record<string, any>;
}

export interface SearchEntitiesParams {
  q?: string;
  category_id?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DuplicatePair {
  entity1: Entity;
  entity2: Entity;
  similarity_score: number;
  name_match: boolean;
  email_match: boolean;
  phone_match: boolean;
}

export interface MergeEntitiesRequest {
  primaryEntityId: string;
  duplicateEntityId: string;
  mergedFields: {
    name: string;
    email: string;
    phone?: string;
    metadata?: Record<string, any>;
  };
  categoryIds?: string[];
  note?: string;
}
