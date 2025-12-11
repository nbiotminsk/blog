import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from '@/components/layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Entities = lazy(() => import('@/pages/Entities').then(module => ({ default: module.Entities })));
const Categories = lazy(() => import('@/pages/Categories').then(module => ({ default: module.Categories })));
const Templates = lazy(() => import('@/pages/Templates').then(module => ({ default: module.Templates })));
const Documents = lazy(() => import('@/pages/Documents').then(module => ({ default: module.Documents })));
const Duplicates = lazy(() => import('@/pages/Duplicates').then(module => ({ default: module.Duplicates })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/duplicates" element={<Duplicates />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
