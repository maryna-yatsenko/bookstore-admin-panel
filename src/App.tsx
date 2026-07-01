import { useState } from 'react';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Orders } from './pages/Orders/Orders';
import { Users } from './pages/Users/Users';
import { Products } from './pages/Products/Products';

type Page = 'dashboard' | 'orders' | 'users' | 'products';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigate = (page: string) => {
    if (page === 'dashboard' || page === 'orders' || page === 'users' || page === 'products') {
      setCurrentPage(page);
    }
  };

  switch (currentPage) {
    case 'orders':
      return <Orders onNavigate={navigate} />;
    case 'users':
      return <Users onNavigate={navigate} />;
    case 'products':
      return <Products onNavigate={navigate} />;
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}
