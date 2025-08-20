// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import MainLayout from './components/layout/MainLayout';
import theme from './theme'; // <-- استيراد الثيم الجديد

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles'; // <-- استيراد موفر الثيم

function App() {
  return (
    // استخدام ThemeProvider لتطبيق الثيم على كل المكونات
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline /> {/* لتوحيد الأنماط الأساسية */}
        <MainLayout>
          <Routes>
            <Route path="/" element={<ScannerPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;