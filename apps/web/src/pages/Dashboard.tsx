import { Suspense } from 'react';
import { useHealthCheck } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const DashboardCard = ({ icon, title, description, link, linkText }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{description}</dd>
          </dl>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3">
      <div className="text-sm">
        <a href={link} className="font-medium text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 min-h-touch inline-flex items-center">
          {linkText}
        </a>
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const { data: health, isLoading, error } = useHealthCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome to the Nikolai Document Management System
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon={
              <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            title="Entities"
            description="Manage contacts"
            link="/entities"
            linkText="View all entities"
          />

          <DashboardCard
            icon={
              <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            title="Categories"
            description="Organize entities"
            link="/categories"
            linkText="View all categories"
          />

          <DashboardCard
            icon={
              <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Templates"
            description="Upload documents"
            link="/templates"
            linkText="View all templates"
          />

          <DashboardCard
            icon={
              <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Documents"
            description="Generate files"
            link="/documents"
            linkText="Generate documents"
          />
        </div>
      </Suspense>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">System Status</h3>
          <div className="mt-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  API Status: <span className="font-medium text-green-700 dark:text-green-400">{health?.status || 'Unknown'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
