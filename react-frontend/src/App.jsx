import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <Router>
      {/* CssBaseline مهم لتوحيد الأنماط */}
      <CssBaseline />
      <Routes>
        <Route path="/" element={<ScannerPage />} />
      </Routes>
    </Router>
  );
}

export default App;