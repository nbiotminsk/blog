import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (record: T) => void;
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  isLoading = false, 
  emptyMessage = 'No data available',
  onRowClick 
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-solid border-current border-r-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  const handleRowClick = (record: T) => {
    if (onRowClick) {
      onRowClick(record);
    }
  };

  return (
    <>
      {/* Desktop Table View (md and up) */}
      <div className="hidden md:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 md:rounded-lg">
        <table className="table">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className || ''}>
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((record, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                onClick={() => handleRowClick(record)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ''}>
                    {column.render 
                      ? column.render(record[column.key], record)
                      : String(record[column.key] || '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="md:hidden space-y-4">
        {data.map((record, rowIndex) => (
          <div 
            key={rowIndex}
            className={`bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3 ${
              onRowClick ? 'cursor-pointer hover:shadow-md active:shadow-lg transition-shadow' : ''
            }`}
            onClick={() => handleRowClick(record)}
          >
            {columns.map((column, colIndex) => {
              const value = column.render 
                ? column.render(record[column.key], record)
                : String(record[column.key] || '');
              
              if (!value || value === '-') return null;
              
              return (
                <div key={colIndex} className="flex flex-col">
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {column.mobileLabel || column.title}
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">
                    {value}
                  </dd>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
