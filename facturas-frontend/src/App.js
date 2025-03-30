import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ImportPage from './pages/ImportPage';
import SearchPage from './pages/SearchPage';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route element={<RequireAuth />}>
            <Route path="/importar" element={<ImportPage />} />
            <Route path="/buscar" element={<SearchPage />} />
            {/* Aquí puedes agregar más rutas privadas luego */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;