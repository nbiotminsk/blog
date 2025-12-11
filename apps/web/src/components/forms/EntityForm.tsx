import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Entity, Category, CreateEntityRequest, UpdateEntityRequest } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const entitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

type EntityFormData = z.infer<typeof entitySchema>;

interface EntityFormProps {
  entity?: Entity;
  categories: Category[];
  onSubmit: (data: CreateEntityRequest | UpdateEntityRequest) => void;
  isLoading?: boolean;
  error?: string;
}

export const EntityForm = ({ entity, categories, onSubmit, isLoading, error }: EntityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntityFormData>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: entity?.name || '',
      email: entity?.email || '',
      phone: entity?.phone || '',
      metadata: entity?.metadata || {},
    },
  });

  const handleFormSubmit = (data: EntityFormData) => {
    onSubmit(data);
  };

  const assignedCategoryIds = entity?.categories?.map(c => c.id) || [];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            autoComplete="name"
            className="input mt-1 w-full"
            placeholder="Enter entity name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            inputMode="email"
            className="input mt-1 w-full"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            autoComplete="tel"
            inputMode="tel"
            className="input mt-1 w-full"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center min-h-touch">
                  <input
                    id={`category-${category.id}`}
                    name="categories"
                    type="checkbox"
                    value={category.id}
                    defaultChecked={assignedCategoryIds.includes(category.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-3 block text-sm text-gray-900 dark:text-gray-100"
                  >
                    {category.name}
                    {category.description && (
                      <span className="text-gray-500 dark:text-gray-400"> - {category.description}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-secondary w-full sm:w-auto"
          disabled={isLoading}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          {entity ? 'Update Entity' : 'Create Entity'}
        </button>
      </div>
    </form>
  );
};
