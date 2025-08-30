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
import { AuthProvider } from './context/AuthContext';

// Page Components
import HomePage from './pages/website/HomePage';
import LoginPage from './pages/auth/LoginPage';
import MarketOwnerLoginPage from './pages/auth/MarketOwnerLoginPage';

// Admin Components
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import MarketsList from './pages/admin/MarketsList';
import MarketCreate from './pages/admin/MarketCreate';
import MarketDetails from './pages/admin/MarketDetails';
import UsersList from './pages/admin/UsersList';
import UserCreate from './pages/admin/UserCreate';
import UserEdit from './pages/admin/UserEdit';

// Market Owner Components
import MarketOwnerLayout from './layouts/market-owner/MarketOwnerLayout';
import MarketOwnerDashboard from './pages/market-owner/Dashboard';
import MarketOwnerProductsList from './pages/market-owner/ProductsList';
import MarketOwnerProductCreate from './pages/market-owner/ProductCreate';
import MarketOwnerProductEdit from './pages/market-owner/ProductEdit';
import MarketOwnerShelvesList from './pages/market-owner/ShelvesList';
import MarketOwnerBulkUpload from './pages/market-owner/BulkUpload';
import QrCodeGenerator from './pages/market-owner/QrCodeGenerator';

// Common Components
import ProtectedRoute from './components/ProtectedRoute';

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
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/:marketUuid" element={<ScannerPage />} />

                  {/* Auth Routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/market-owner/login" element={<MarketOwnerLoginPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="markets" element={<MarketsList />} />
                    <Route path="markets/new" element={<MarketCreate />} />
                    <Route path="markets/:marketUuid" element={<MarketDetails />} />
                    <Route path="users" element={<UsersList />} />
                    <Route path="users/new" element={<UserCreate />} />
                    <Route path="users/:userId/edit" element={<UserEdit />} />
                  </Route>

                  {/* Market Owner Routes */}
                  <Route path="/market-owner" element={<ProtectedRoute requiredRole="owner"><MarketOwnerLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<MarketOwnerDashboard />} />
                    <Route path="products" element={<MarketOwnerProductsList />} />
                    <Route path="products/new" element={<MarketOwnerProductCreate />} />
                    <Route path="products/:productId/edit" element={<MarketOwnerProductEdit />} />
                    <Route path="shelves" element={<MarketOwnerShelvesList />} />
                    <Route path="bulk-upload" element={<MarketOwnerBulkUpload />} />
                    <Route path="qr-generator" element={<QrCodeGenerator />} />
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