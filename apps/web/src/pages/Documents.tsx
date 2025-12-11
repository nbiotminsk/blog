import { useState } from 'react';
import { useEntities, useTemplates, useGenerateDocument, useDocumentRecords } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';
import { Entity, Template, GenerateDocumentRequest } from '@/types';

export const Documents = () => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [payloadData, setPayloadData] = useState<Record<string, any>>({});
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // API hooks
  const { data: entities = [] } = useEntities();
  const { data: templates = [] } = useTemplates();
  const generateDocument = useGenerateDocument();
  const { data: documents = [], isLoading: documentsLoading } = useDocumentRecords();

  const handleGenerateDocument = async () => {
    if (!selectedEntity || !selectedTemplate) return;

    try {
      await generateDocument.mutateAsync({
        entity_id: selectedEntity.id,
        template_id: selectedTemplate.id,
        payload: payloadData,
      });
      
      // Reset form
      setSelectedEntity(null);
      setSelectedTemplate(null);
      setPayloadData({});
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  };

  const handlePayloadChange = (key: string, value: string) => {
    setPayloadData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const documentColumns = [
    {
      key: 'entity',
      title: 'Entity',
      render: (entity: Entity) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{entity.name}</div>
          <div className="text-sm text-gray-500">{entity.email}</div>
        </div>
      ),
    },
    {
      key: 'template',
      title: 'Template',
      render: (template: Template) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{template.name}</div>
          <div className="text-sm text-gray-500 capitalize">{template.format}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (status: string) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          processing: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800',
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
            Documents
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate documents from templates and entities
          </p>
        </div>
        <div className="flex sm:mt-0">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="btn btn-primary w-full sm:w-auto"
            disabled={!entities.length || !templates.length}
          >
            Generate Document
          </button>
        </div>
      </div>

      {/* Generation Form Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          setSelectedEntity(null);
          setSelectedTemplate(null);
          setPayloadData({});
        }}
        title="Generate Document"
        size="xl"
      >
        <div className="space-y-6">
          {!entities.length && (
            <ErrorMessage message="No entities available. Please create some entities first." />
          )}
          
          {!templates.length && (
            <ErrorMessage message="No templates available. Please upload some templates first." />
          )}

          {entities.length > 0 && templates.length > 0 && (
            <>
              <div>
                <label htmlFor="entity-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Entity *
                </label>
                <select
                  id="entity-select"
                  value={selectedEntity?.id || ''}
                  onChange={(e) => {
                    const entity = entities.find(en => en.id === e.target.value);
                    setSelectedEntity(entity || null);
                  }}
                  className="input mt-1 w-full"
                >
                  <option value="">Choose an entity</option>
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name} ({entity.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Template *
                </label>
                <select
                  id="template-select"
                  value={selectedTemplate?.id || ''}
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    setSelectedTemplate(template || null);
                    setPayloadData({});
                  }}
                  className="input mt-1 w-full"
                >
                  <option value="">Choose a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.format.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplate && selectedTemplate.placeholders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Template Data
                    </label>
                    <button
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      Preview Template
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {selectedTemplate.placeholders.map((placeholder) => (
                      <div key={placeholder}>
                        <label htmlFor={`placeholder-${placeholder}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {placeholder}
                        </label>
                        <input
                          type="text"
                          id={`placeholder-${placeholder}`}
                          value={payloadData[placeholder] || ''}
                          onChange={(e) => handlePayloadChange(placeholder, e.target.value)}
                          className="input mt-1 w-full"
                          placeholder={`Enter value for ${placeholder}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate && selectedTemplate.placeholders.length === 0 && (
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    This template doesn't have any detected placeholders. A basic document will be generated.
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateDocument}
                  disabled={!selectedEntity || !selectedTemplate || generateDocument.isPending}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {generateDocument.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                  Generate Document
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Template Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Template Preview"
        size="xl"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {selectedTemplate.format} template
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Required Placeholders:</h4>
              {selectedTemplate.placeholders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTemplate.placeholders.map((placeholder, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-mono text-gray-700">{placeholder}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No placeholders detected</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Document Records */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
            Generation History
          </h3>
          
          <Table
            data={documents}
            columns={documentColumns}
            isLoading={documentsLoading}
            emptyMessage="No documents generated yet"
          />
        </div>
      </div>
    </div>
  );
};
