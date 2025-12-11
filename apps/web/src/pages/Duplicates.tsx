import { useState, Suspense } from 'react';
import { useFindDuplicates, useMergeEntities } from '@/hooks/useApi';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DuplicatePair, Entity } from '@/types';

export const Duplicates = () => {
  const [threshold, setThreshold] = useState(0.5);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [primaryEntity, setPrimaryEntity] = useState<Entity | null>(null);

  const { data: duplicates = [], isLoading, error } = useFindDuplicates({ threshold });
  const mergeEntities = useMergeEntities();

  const handleMerge = async () => {
    if (!selectedPair || !primaryEntity) return;

    const duplicateEntity = primaryEntity.id === selectedPair.entity1.id 
      ? selectedPair.entity2 
      : selectedPair.entity1;

    try {
      await mergeEntities.mutateAsync({
        primaryEntityId: primaryEntity.id,
        duplicateEntityId: duplicateEntity.id,
        mergedFields: {
          name: primaryEntity.name,
          email: primaryEntity.email,
          phone: primaryEntity.phone,
          metadata: primaryEntity.metadata,
        },
        note: `Merged duplicate entities with similarity score: ${selectedPair.similarity_score.toFixed(2)}`,
      });
      
      setIsMergeModalOpen(false);
      setSelectedPair(null);
      setPrimaryEntity(null);
    } catch (error) {
      console.error('Failed to merge entities:', error);
    }
  };

  const openMergeModal = (pair: DuplicatePair) => {
    setSelectedPair(pair);
    setPrimaryEntity(pair.entity1);
    setIsMergeModalOpen(true);
  };

  const duplicateColumns = [
    {
      key: 'entity1',
      title: 'Entity 1',
      mobileLabel: 'First Entity',
      render: (entity: Entity) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{entity.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{entity.email}</div>
          {entity.phone && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{entity.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'entity2',
      title: 'Entity 2',
      mobileLabel: 'Second Entity',
      render: (entity: Entity) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{entity.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{entity.email}</div>
          {entity.phone && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{entity.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'similarity_score',
      title: 'Similarity',
      mobileLabel: 'Match Score',
      render: (score: number, record: DuplicatePair) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {(score * 100).toFixed(1)}%
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {record.name_match && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Name
              </span>
            )}
            {record.email_match && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Email
              </span>
            )}
            {record.phone_match && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                Phone
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, record: DuplicatePair) => (
        <button
          onClick={() => openMergeModal(record)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium min-h-touch"
        >
          Merge
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
            Duplicate Entities
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Find and merge duplicate entity records
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Similarity Threshold: {(threshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              id="threshold"
              min="0"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Low (0%)</span>
              <span>Medium (50%)</span>
              <span>High (100%)</span>
            </div>
          </div>

          {error && <ErrorMessage message="Failed to load duplicates" />}
          
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Table
              data={duplicates}
              columns={duplicateColumns}
              isLoading={isLoading}
              emptyMessage="No duplicate entities found with the current threshold"
            />
          </Suspense>
        </div>
      </div>

      <Modal
        isOpen={isMergeModalOpen}
        onClose={() => {
          setIsMergeModalOpen(false);
          setSelectedPair(null);
          setPrimaryEntity(null);
        }}
        title="Merge Duplicate Entities"
        size="lg"
      >
        {selectedPair && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Select which entity should be the primary record. The other entity will be merged into it and then deleted.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  primaryEntity?.id === selectedPair.entity1.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setPrimaryEntity(selectedPair.entity1)}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={primaryEntity?.id === selectedPair.entity1.id}
                    onChange={() => setPrimaryEntity(selectedPair.entity1)}
                    className="mt-1 h-5 w-5"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedPair.entity1.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedPair.entity1.email}
                    </div>
                    {selectedPair.entity1.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPair.entity1.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  primaryEntity?.id === selectedPair.entity2.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setPrimaryEntity(selectedPair.entity2)}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={primaryEntity?.id === selectedPair.entity2.id}
                    onChange={() => setPrimaryEntity(selectedPair.entity2)}
                    className="mt-1 h-5 w-5"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedPair.entity2.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedPair.entity2.email}
                    </div>
                    {selectedPair.entity2.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPair.entity2.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="btn btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleMerge}
                disabled={!primaryEntity || mergeEntities.isPending}
                className="btn btn-danger w-full sm:w-auto"
              >
                {mergeEntities.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Merge Entities
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
