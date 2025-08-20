import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
      {/* CssBaseline يقوم بتوحيد وتطبيع الأنماط عبر المتصفحات المختلفة */}
      <CssBaseline />

      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Routes>
            {/* المسار الرئيسي للتطبيق يعرض صفحة الماسح */}
            <Route path="/" element={<ScannerPage />} />

            {/* مستقبلاً، هنا يمكن إضافة مسارات لوحة التحكم */}
            {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;