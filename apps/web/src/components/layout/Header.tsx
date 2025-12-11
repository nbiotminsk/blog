import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Nikolai Dashboard
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/entities"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/entities')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Entities
            </Link>
            <Link
              to="/categories"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/categories')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/templates"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/templates')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Templates
            </Link>
            <Link
              to="/documents"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/documents')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
