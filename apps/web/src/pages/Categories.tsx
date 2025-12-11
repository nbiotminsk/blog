import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useApi';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

export const Categories = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // API hooks
  const { data: categories = [], isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      await createCategory.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
    if (!selectedCategory) return;
    
    try {
      await updateCategory.mutateAsync({ id: selectedCategory.id, data });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory.mutateAsync(category.id);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const categoryColumns = [
    {
      key: 'name',
      title: 'Name',
      render: (value: string, record: Category) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          {record.description && (
            <div className="text-sm text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, record: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditCategory(record)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(record)}
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
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Categories
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage categories to organize your entities
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            Create Category
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {error && <ErrorMessage message="Failed to load categories" />}
          
          <Table
            data={categories}
            columns={categoryColumns}
            isLoading={isLoading}
            emptyMessage="No categories found"
          />
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Category"
        size="md"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          isLoading={createCategory.isPending}
          error={createCategory.error?.message}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        size="md"
      >
        <CategoryForm
          category={selectedCategory || undefined}
          onSubmit={handleUpdateCategory}
          isLoading={updateCategory.isPending}
          error={updateCategory.error?.message}
        />
      </Modal>
    </div>
  );
};
