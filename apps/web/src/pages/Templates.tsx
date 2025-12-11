import { useState } from 'react';
import { useTemplates, useCreateTemplate, useDeleteTemplate } from '@/hooks/useApi';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { TemplateUploadForm } from '@/components/forms/TemplateUploadForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Template } from '@/types';

export const Templates = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // API hooks
  const { data: templates = [], isLoading, error } = useTemplates();
  const createTemplate = useCreateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const handleUploadTemplate = async (data: { name: string; format: 'docx' | 'html'; file: File }) => {
    try {
      await createTemplate.mutateAsync(data);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Failed to upload template:', error);
    }
  };

  const handleDeleteTemplate = async (template: Template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await deleteTemplate.mutateAsync(template.id);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const templateColumns = [
     {
       key: 'name',
       title: 'Name',
       render: (value: string, record: Template) => (
         <div>
           <div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div>
           <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{record.format} template</div>
         </div>
       ),
     },
     {
       key: 'placeholders',
       title: 'Placeholders',
       render: (placeholders: string[]) => (
         <div className="flex flex-wrap gap-1">
           {placeholders?.slice(0, 3).map((placeholder, index) => (
             <span
               key={index}
               className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
             >
               {placeholder}
             </span>
           ))}
           {placeholders?.length > 3 && (
             <span className="text-xs text-gray-500 dark:text-gray-400">
               +{placeholders.length - 3} more
             </span>
           )}
           {!placeholders?.length && (
             <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
           )}
         </div>
       ),
     },
     {
       key: 'file_size',
       title: 'Size',
       render: (value: number) => (
         <span className="text-sm text-gray-900 dark:text-gray-100">{formatFileSize(value)}</span>
       ),
     },
     {
       key: 'created_at',
       title: 'Created',
       render: (value: string) => (
         <span className="text-sm text-gray-500 dark:text-gray-400">
           {new Date(value).toLocaleDateString()}
         </span>
       ),
     },
     {
       key: 'actions',
       title: 'Actions',
       render: (value: any, record: Template) => (
         <div className="flex space-x-2">
           <button
             onClick={() => handlePreviewTemplate(record)}
             className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium transition-colors"
           >
             Preview
           </button>
           <button
             onClick={() => handleDeleteTemplate(record)}
             className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium transition-colors"
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Templates
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload and manage document templates (DOCX/HTML)
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-primary"
          >
            Upload Template
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6">
          {error && <ErrorMessage message="Failed to load templates" />}

          <Table
            data={templates}
            columns={templateColumns}
            isLoading={isLoading}
            emptyMessage="No templates found. Upload your first template to get started."
          />
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Template"
        size="lg"
      >
        <TemplateUploadForm
          onSubmit={handleUploadTemplate}
          isLoading={createTemplate.isPending}
          error={createTemplate.error?.message}
        />
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedTemplate(null);
        }}
        title="Template Preview"
        size="xl"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {selectedTemplate.format} template • {formatFileSize(selectedTemplate.file_size)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Detected Placeholders:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.placeholders.map((placeholder, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {placeholder}
                  </span>
                ))}
                {!selectedTemplate.placeholders.length && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No placeholders detected</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
