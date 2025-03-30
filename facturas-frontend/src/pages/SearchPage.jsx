import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Button, Form } from 'react-bootstrap';
import CreditNotesModal from '../components/CreditNotesModal';

function SearchPage() {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [estadoFactura, setEstadoFactura] = useState('');
    const [estadoPago, setEstadoPago] = useState('');
    const [facturas, setFacturas] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(facturas.length / itemsPerPage);
    const paginatedFacturas = facturas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get('/Invoices/status');
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

            setCurrentPage(1);
        } catch (err) {
            console.error(err);
            setFacturas([]);
            setError('No se encontraron facturas con esos filtros.');
        }
    };

    const handleShowModal = (creditNotes) => {
        setSelectedCreditNotes(creditNotes);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

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
                            setCurrentPage(1);
                            api.get('/Invoices/status')
                                .then(res => setFacturas(res.data))
                                .catch(() => setFacturas([]));
                        }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {facturas.length > 0 && (
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <Form.Select
                        style={{ width: 'auto' }}
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5 por página</option>
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                    </Form.Select>
                    <div>Página {currentPage} de {totalPages}</div>
                </div>
            )}

            {facturas.length > 0 ? (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Saldo Pendiente</th>
                                <th>Estado</th>
                                <th>Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFacturas.map((f) => {
                                const totalCreditNotes = f.creditNotes?.reduce((sum, nc) => sum + nc.amount, 0) || 0;
                                const saldoPendiente = f.totalAmount - totalCreditNotes;

                                return (
                                    <tr key={f.invoiceNumber}>
                                        <td>{f.invoiceNumber}</td>
                                        <td>{new Date(f.issueDate).toLocaleDateString()}</td>
                                        <td>{f.customer.name}</td>
                                        <td>${f.totalAmount.toFixed(2)}</td>
                                        <td>${saldoPendiente.toFixed(2)}</td>
                                        <td>{f.status}</td>
                                        <td>{f.paymentStatus}</td>
                                        <td>
                                            {f.creditNotes?.length > 0 && (
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => handleShowModal(f.creditNotes)}
                                                >
                                                    Ver NC
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <Button
                            variant="secondary"
                            className="me-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Siguiente
                        </Button>
                    </div>
                </>
            ) : (
                <div className="alert alert-warning text-center">
                    {error || 'No hay facturas disponibles.'}
                </div>
            )}

            <CreditNotesModal
                show={showModal}
                handleClose={handleCloseModal}
                creditNotes={selectedCreditNotes}
            />
        </div>
    );
}

export default SearchPage;
