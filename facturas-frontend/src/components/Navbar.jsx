import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { logout } = useAuth();

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/importar">Facturación</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/importar">Importar Facturas</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/buscar">Buscar Facturas</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/credit-notes">Notas de Crédito</Link>
                        </li>
                    </ul>
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;