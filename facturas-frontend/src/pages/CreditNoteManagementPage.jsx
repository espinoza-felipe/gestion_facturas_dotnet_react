import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Form, Button, Table, Alert } from 'react-bootstrap';

function CreditNoteManagementPage() {
    const [facturas, setFacturas] = useState([]);
    const [form, setForm] = useState({ invoiceId: '', amount: '', reason: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [creditNotes, setCreditNotes] = useState([]);
    const [saldoDisponible, setSaldoDisponible] = useState(null);
    const [advertencia, setAdvertencia] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 10;

    useEffect(() => {
        api.get('/Invoices/status')
            .then(res => setFacturas(res.data))
            .catch(() => setFacturas([]));

        api.get('/CreditNotes')
            .then(res => setCreditNotes(res.data))
            .catch(() => setCreditNotes([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        setAdvertencia('');
        setError('');
        setSuccess('');

        if (name === 'invoiceId') {
            const selected = facturas.find(f => f.invoiceNumber === parseInt(value));
            if (selected) {
                const total = selected.totalAmount;
                const totalNC = selected.creditNotes?.reduce((sum, n) => sum + n.amount, 0) || 0;
                const saldo = total - totalNC;
                setSaldoDisponible(saldo);

                if (selected.status === 'Cancelled') {
                    setAdvertencia('⚠️ Esta factura está cancelada. No se recomienda agregar una nota de crédito.');
                }
            } else {
                setSaldoDisponible(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const selected = facturas.find(f => f.invoiceNumber === parseInt(form.invoiceId));
        if (!selected) {
            setError('Debe seleccionar una factura válida.');
            return;
        }

        if (selected.status === 'Cancelled') {
            setError('No se puede agregar una nota de crédito a una factura cancelada.');
            return;
        }

        if (parseFloat(form.amount) > saldoDisponible) {
            setError(`El monto excede el saldo pendiente de $${saldoDisponible}`);
            return;
        }

        try {
            await api.post(`/CreditNotes/${form.invoiceId}`, {
                amount: parseFloat(form.amount),
                reason: form.reason,
            });

            setError('');
            setSuccess('Nota de crédito agregada con éxito.');
            setForm({ invoiceId: '', amount: '', reason: '' });
            setSaldoDisponible(null);

            const res = await api.get('/CreditNotes');
            setCreditNotes(res.data);
        } catch (err) {
            setError(err.response?.data || 'Error al agregar la nota de crédito.');
        }
    };
    const sortedNotes = [...creditNotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalPages = Math.ceil(sortedNotes.length / notesPerPage);
    const startIndex = (currentPage - 1) * notesPerPage;
    const currentNotes = sortedNotes.slice(startIndex, startIndex + notesPerPage);


    return (
        <div className="container mt-4">
            <h2>Gestión de Notas de Crédito</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Factura asociada</Form.Label>
                    <Form.Select name="invoiceId" value={form.invoiceId} onChange={handleChange} required>
                        <option value="">Seleccione una factura</option>
                        {facturas.map(f => (
                            <option key={f.invoiceNumber} value={f.invoiceNumber}>
                                #{f.invoiceNumber} - {f.customer.name} - ${f.totalAmount} ({f.status})
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {saldoDisponible !== null && (
                    <Alert variant="info" className="mt-2">
                        Saldo pendiente: <strong>${saldoDisponible}</strong>
                    </Alert>
                )}

                {advertencia && (
                    <Alert variant="warning" className="mt-2">{advertencia}</Alert>
                )}

                <Form.Group className="mt-2">
                    <Form.Label>Monto</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Razón</Form.Label>
                    <Form.Control
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}

                    />
                </Form.Group>

                <Button className="mt-3" type="submit" disabled={!!advertencia}>
                    Agregar Nota
                </Button>
            </Form>

            {success ? (
                <Alert variant="success" className="mt-3">{success}</Alert>
            ) : error && (
                <Alert variant="danger" className="mt-3">{error}</Alert>
            )}


            <h4 className="mt-5">Notas de Crédito Existentes</h4>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Factura</th>
                        <th>Monto</th>
                        <th>Razón</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {creditNotes.length > 0 ? (
                        [...creditNotes]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)
                            .map((n, i) => (
                                <tr key={i}>
                                    <td>{n.id}</td>
                                    <td>{n.invoiceId}</td>
                                    <td>${n.amount}</td>
                                    <td>{n.reason}</td>
                                    <td>{new Date(n.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay notas de crédito registradas.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default CreditNoteManagementPage;
