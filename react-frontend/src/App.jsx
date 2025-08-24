// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import MainLayout from './components/layout/MainLayout';
import theme, { rtlCache } from './theme'; // <-- استيراد الثيم الجديد

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles'; // <-- استيراد موفر الثيم
import { CacheProvider } from '@emotion/react';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    // استخدام ThemeProvider لتطبيق الثيم على كل المكونات
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <Router>
            <CssBaseline /> {/* لتوحيد الأنماط الأساسية */}
            <MainLayout>
              <Routes>
                <Route path="/" element={<ScannerPage />} />
              </Routes>
            </MainLayout>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;