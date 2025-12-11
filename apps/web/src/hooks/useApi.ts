import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
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
} from '@/types';

// Entity hooks
export const useCreateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntityRequest) => apiClient.createEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityRequest }) =>
      apiClient.updateEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};

export const useEntity = (id: string) => {
  return useQuery({
    queryKey: ['entities', id],
    queryFn: () => apiClient.getEntity(id),
    enabled: !!id,
  });
};

export const useSearchEntities = (params: SearchEntitiesParams) => {
   return useQuery({
     queryKey: ['entities', 'search', params],
     queryFn: () => apiClient.searchEntities(params),
   });
 };

export const useEntities = () => {
  return useQuery({
    queryKey: ['entities'],
    queryFn: () => apiClient.listEntities(),
  });
};

// Category hooks
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      apiClient.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.listCategories(),
  });
};

// Template hooks
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => apiClient.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: ['templates', id],
    queryFn: () => apiClient.getTemplate(id),
    enabled: !!id,
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => apiClient.listTemplates(),
  });
};

// Document hooks
export const useGenerateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateDocumentRequest) => apiClient.generateDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useDocumentRecord = (id: string) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => apiClient.getDocumentRecord(id),
    enabled: !!id,
  });
};

export const useDocumentRecords = (params?: { entity_id?: string; template_id?: string; status?: string }) => {
  return useQuery({
    queryKey: ['documents', 'list', params],
    queryFn: () => apiClient.listDocumentRecords(params),
  });
};

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
  });
};
