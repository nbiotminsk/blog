import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  Entity,
  Category,
  Template,
  DocumentRecord,
  CreateEntityRequest,
  UpdateEntityRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTemplateRequest,
  GenerateDocumentRequest,
  SearchEntitiesParams,
  PaginatedResponse,
  ApiError,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  // Entity endpoints
  async createEntity(data: CreateEntityRequest): Promise<Entity> {
    const response = await this.client.post<Entity>('/api/entities', data);
    return response.data;
  }

  async getEntity(id: string): Promise<Entity> {
    const response = await this.client.get<Entity>(`/api/entities/${id}`);
    return response.data;
  }

  async updateEntity(id: string, data: UpdateEntityRequest): Promise<Entity> {
    const response = await this.client.patch<Entity>(`/api/entities/${id}`, data);
    return response.data;
  }

  async deleteEntity(id: string): Promise<void> {
    await this.client.delete(`/api/entities/${id}`);
  }

  async searchEntities(params: SearchEntitiesParams): Promise<PaginatedResponse<Entity>> {
    const response = await this.client.get('/api/entities/search', { params });
    
    // Transform the response to match the expected format
    const data = response.data;
    return {
      data: data.data || [],
      total: data.total || 0,
      page: Math.floor((params.offset || 0) / (params.limit || 20)) + 1,
      limit: params.limit || 20,
      totalPages: Math.ceil((data.total || 0) / (params.limit || 20)),
    };
  }

  // Category endpoints
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.client.post<Category>('/api/categories', data);
    return response.data;
  }

  async getCategory(id: string): Promise<Category> {
    const response = await this.client.get<Category>(`/api/categories/${id}`);
    return response.data;
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await this.client.patch<Category>(`/api/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.client.delete(`/api/categories/${id}`);
  }

  async listCategories(): Promise<Category[]> {
    const response = await this.client.get<Category[]>('/api/categories');
    return response.data;
  }

  // Template endpoints
  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('format', data.format);

    const response = await this.client.post<Template>('/api/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await this.client.get<Template>(`/api/templates/${id}`);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.client.delete(`/api/templates/${id}`);
  }

  async listTemplates(): Promise<Template[]> {
    const response = await this.client.get<Template[]>('/api/templates');
    return response.data;
  }

  // Document endpoints
  async generateDocument(data: GenerateDocumentRequest): Promise<DocumentRecord> {
    const response = await this.client.post<DocumentRecord>('/api/documents/generate', data);
    return response.data;
  }

  async getDocumentRecord(id: string): Promise<DocumentRecord> {
    const response = await this.client.get<DocumentRecord>(`/api/documents/${id}`);
    return response.data;
  }

  async listDocumentRecords(params?: { entity_id?: string; template_id?: string; status?: string }): Promise<DocumentRecord[]> {
    const response = await this.client.get<DocumentRecord[]>('/api/documents', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get<{ status: string }>('/api/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
