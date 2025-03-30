import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const CreditNotesModal = ({ show, handleClose, creditNotes }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notas de Crédito Asociadas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {creditNotes.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
              
                <th>Monto</th>
                <th>Fecha</th>
                <th>Razón</th>
              </tr>
            </thead>
            <tbody>
              {creditNotes.map((note) => (
                <tr key={note.id}>
                  <td>{note.amount}</td>
                  <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                  <td>{note.reason}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hay notas de crédito asociadas a esta factura.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditNotesModal;
