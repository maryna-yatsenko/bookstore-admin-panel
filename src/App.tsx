import { useState } from 'react';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Orders } from './pages/Orders/Orders';
import { Users } from './pages/Users/Users';
import { Products } from './pages/Products/Products';
import { ProductEdit } from './pages/ProductEdit/ProductEdit';
import { WorkTasks } from './pages/WorkTasks/WorkTasks';
import { Blog } from './pages/Blog/Blog';

type Page = 'dashboard' | 'orders' | 'users' | 'products' | 'product-edit' | 'tasks' | 'blog';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigate = (page: string) => {
    if (
      page === 'dashboard' || page === 'orders' || page === 'users' ||
      page === 'products' || page === 'product-edit' || page === 'tasks' ||
      page === 'blog'
    ) {
      setCurrentPage(page as Page);
    }
  };

  switch (currentPage) {
    case 'orders':
      return <Orders onNavigate={navigate} />;
    case 'users':
      return <Users onNavigate={navigate} />;
    case 'products':
      return (
        <>
          <Products onNavigate={navigate} />
          {/* ProductEdit renders as a fixed overlay on top */}
        </>
      );
    case 'product-edit':
      return (
        <>
          <Products onNavigate={navigate} />
          <ProductEdit onClose={() => navigate('products')} />
        </>
      );
    case 'tasks':
      return <WorkTasks onNavigate={navigate} />;
    case 'blog':
      return <Blog onNavigate={navigate} />;
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}
