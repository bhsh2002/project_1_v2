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
import MarketsList from './pages/admin/MarketsList';
import MarketCreate from './pages/admin/MarketCreate';
import MarketDetails from './pages/admin/MarketDetails';
import UsersList from './pages/admin/UsersList';
import UserCreate from './pages/admin/UserCreate';
import UserEdit from './pages/admin/UserEdit';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/website/HomePage';

function App() {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <AuthProvider>
            <Router>
              <CssBaseline />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/:marketUuid" element={<ScannerPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="markets" element={<MarketsList />} />
                    <Route path="markets/new" element={<MarketCreate />} />
                    <Route path="markets/:marketUuid" element={<MarketDetails />} />
                    <Route path="users" element={<UsersList />} />
                    <Route path="users/new" element={<UserCreate />} />
                    <Route path="users/:userId/edit" element={<UserEdit />} />
                    {/* يمكن إضافة بقية الصفحات لاحقًا */}
                  </Route>
                </Routes>
              </MainLayout>
            </Router>
          </AuthProvider>
        </CartProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;