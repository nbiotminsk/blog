import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Mobile: full width, md+ centered with max-width */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mx-auto lg:max-w-7xl">
          {/* Content container with dark mode support */}
          <div className="text-gray-900 dark:text-gray-100">
            {children}
          </div>
        </div>
      </main>

      {/* Safe Area Bottom Spacer for Mobile Bottom Nav */}
      <div className="md:hidden h-16 flex-shrink-0 safe-bottom" />
    </div>
  );
};
