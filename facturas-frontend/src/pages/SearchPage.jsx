import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function SearchPage() {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [estadoFactura, setEstadoFactura] = useState('');
    const [estadoPago, setEstadoPago] = useState('');
    const [facturas, setFacturas] = useState([]);
    const [error, setError] = useState('');

    // 🔄 Cargar todas las facturas al inicio
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get('/Invoices/status'); // sin filtros = trae todas
                setFacturas(response.data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las facturas.');
            }
        };
        fetchAll();
    }, []);

    const handleBuscar = async () => {
        try {
            setError('');
            let url = '';

            if (invoiceNumber) {
                url = `/Invoices/${invoiceNumber}`;
                const response = await api.get(url);
                setFacturas([response.data]);
            } else {
                const params = new URLSearchParams();
                if (estadoFactura) params.append('factura', estadoFactura);
                if (estadoPago) params.append('pago', estadoPago);
                url = `/Invoices/status?${params.toString()}`;
                const response = await api.get(url);
                setFacturas(response.data);
            }
        } catch (err) {
            console.error(err);
            setFacturas([]);
            setError('No se encontraron facturas con esos filtros.');
        }
    };

    return (
        <div className="container">
            <h2>Buscar Facturas</h2>
            <div className="row g-2 align-items-end mb-4">
                <div className="col-md-3">
                    <label className="form-label">Número de Factura</label>
                    <input
                        type="number"
                        className="form-control"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Estado Factura</label>
                    <select
                        className="form-select"
                        value={estadoFactura}
                        onChange={(e) => setEstadoFactura(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="0">Issued</option>
                        <option value="1">Partial</option>
                        <option value="2">Cancelled</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Estado de Pago</label>
                    <select
                        className="form-select"
                        value={estadoPago}
                        onChange={(e) => setEstadoPago(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="0">Pending</option>
                        <option value="1">Paid</option>
                        <option value="2">Overdue</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary w-100" onClick={handleBuscar}>
                        Buscar
                    </button>
                    <button
                        className="btn btn-secondary w-100 mt-2"
                        onClick={() => {
                            setInvoiceNumber('');
                            setEstadoFactura('');
                            setEstadoPago('');
                            setError('');
                            api.get('/Invoices/status') // recarga todas las facturas
                                .then(res => setFacturas(res.data))
                                .catch(() => setFacturas([]));
                        }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* ✅ Resultados */}
            {facturas.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((f) => (
                            <tr key={f.invoiceNumber}>
                                <td>{f.invoiceNumber}</td>
                                <td>{new Date(f.issueDate).toLocaleDateString()}</td>
                                <td>{f.customer.name}</td>
                                <td>${f.totalAmount.toFixed(2)}</td>
                                <td>{f.status}</td>
                                <td>{f.paymentStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="alert alert-warning text-center">
                    {error || 'No hay facturas disponibles.'}
                </div>
            )}
        </div>
    );
}

export default SearchPage;
