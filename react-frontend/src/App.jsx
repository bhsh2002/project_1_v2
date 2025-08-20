import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import MainLayout from './components/layout/MainLayout'; // استيراد الهيكل الجديد

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <Router>
      <CssBaseline />
      <MainLayout>
        <Routes>
          <Route path="/" element={<ScannerPage />} />
          {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;