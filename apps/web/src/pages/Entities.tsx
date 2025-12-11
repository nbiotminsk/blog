import { useState, useMemo } from 'react';
import { debounce } from 'lodash';
import { useSearchEntities, useCreateEntity, useUpdateEntity, useDeleteEntity, useCategories } from '@/hooks/useApi';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { EntityForm } from '@/components/forms/EntityForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Entity, CreateEntityRequest, UpdateEntityRequest } from '@/types';

export const Entities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const limit = 10;

  // API hooks
  const { data: entitiesData, isLoading: entitiesLoading, error: entitiesError } = useSearchEntities({
    q: searchTerm,
    page: currentPage,
    limit,
  });

  const { data: categories = [] } = useCategories();
  
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();
  const deleteEntity = useDeleteEntity();

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleCreateEntity = async (data: CreateEntityRequest) => {
    try {
      await createEntity.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create entity:', error);
    }
  };

  const handleUpdateEntity = async (data: UpdateEntityRequest) => {
    if (!selectedEntity) return;
    
    try {
      await updateEntity.mutateAsync({ id: selectedEntity.id, data });
      setIsEditModalOpen(false);
      setSelectedEntity(null);
    } catch (error) {
      console.error('Failed to update entity:', error);
    }
  };

  const handleDeleteEntity = async (entity: Entity) => {
    if (window.confirm(`Are you sure you want to delete "${entity.name}"?`)) {
      try {
        await deleteEntity.mutateAsync(entity.id);
      } catch (error) {
        console.error('Failed to delete entity:', error);
      }
    }
  };

  const handleEditEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    setSelectedCategories(entity.categories?.map(c => c.id) || []);
    setIsEditModalOpen(true);
  };

  const entityColumns = [
    {
      key: 'name',
      title: 'Name',
      render: (value: string, record: Entity) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value || '-'}</span>
      ),
    },
    {
      key: 'categories',
      title: 'Categories',
      render: (categories: any[]) => (
        <div className="flex flex-wrap gap-1">
          {categories?.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {category.name}
            </span>
          )) || <span className="text-sm text-gray-500">-</span>}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, record: Entity) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditEntity(record)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteEntity(record)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
            Entities
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your entities and their categories
          </p>
        </div>
        <div className="flex sm:mt-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
          >
            Create Entity
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Entities
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                inputMode="search"
                className="input w-full pr-10"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {entitiesLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          </div>

          {entitiesError && <ErrorMessage message="Failed to load entities" />}
          
          <Table
            data={entitiesData?.data || []}
            columns={entityColumns}
            isLoading={entitiesLoading}
            emptyMessage="No entities found"
          />

          {entitiesData && entitiesData.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                Showing page {entitiesData.page} of {entitiesData.totalPages} 
                ({entitiesData.total} total items)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 flex-1 sm:flex-none"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, entitiesData.totalPages))}
                  disabled={currentPage === entitiesData.totalPages}
                  className="btn btn-secondary disabled:opacity-50 flex-1 sm:flex-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Entity"
        size="lg"
      >
        <EntityForm
          categories={categories}
          onSubmit={handleCreateEntity}
          isLoading={createEntity.isPending}
          error={createEntity.error?.message}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEntity(null);
        }}
        title="Edit Entity"
        size="lg"
      >
        <EntityForm
          entity={selectedEntity || undefined}
          categories={categories}
          onSubmit={handleUpdateEntity}
          isLoading={updateEntity.isPending}
          error={updateEntity.error?.message}
        />
      </Modal>
    </div>
  );
};
