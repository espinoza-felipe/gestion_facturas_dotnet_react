import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ImportPage from './pages/ImportPage';
import SearchPage from './pages/SearchPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/importar" element={<ImportPage />} />
        <Route path="/buscar" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
