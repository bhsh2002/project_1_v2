// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import MainLayout from './components/layout/MainLayout';
import theme, { rtlCache } from './theme';

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { CartProvider } from './context/CartContext';
import AdminLayout from './layouts/AdminLayout';
import StoresList from './pages/admin/StoresList';
import StoreCreate from './pages/admin/StoreCreate';
import StoreDetails from './pages/admin/StoreDetails';
import UsersList from './pages/admin/UsersList';
import UserCreate from './pages/admin/UserCreate';

function App() {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <Router>
            <CssBaseline />
            <MainLayout>
              <Routes>
                <Route path="/" element={<ScannerPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="stores" element={<StoresList />} />
                  <Route path="stores/new" element={<StoreCreate />} />
                  <Route path="stores/:storeId" element={<StoreDetails />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/new" element={<UserCreate />} />
                  {/* يمكن إضافة بقية الصفحات لاحقًا */}
                </Route>
              </Routes>
            </MainLayout>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;