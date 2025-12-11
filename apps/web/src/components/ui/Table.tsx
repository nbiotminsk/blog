import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => ReactNode;
  className?: string;
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
    <div className="overflow-x-auto overflow-hidden shadow dark:shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 md:rounded-lg">
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
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors' : ''}`}
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
  );
}
