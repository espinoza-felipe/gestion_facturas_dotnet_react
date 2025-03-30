import { useState } from 'react';
import api from '../api/axiosConfig';

function ImportPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleImport = async () => {
    if (!file) {
      setMessage('Selecciona un archivo JSON.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/FacturaImport/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Facturas importadas con éxito.');
      setFile(null);
    } catch (error) {
      setMessage('Error al importar el archivo.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Importar Facturas</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleImport}>Importar</button>
      <p style={{ marginTop: '20px', color: message.includes('éxito') ? 'green' : 'red' }}>
        {message}
      </p>
    </div>
  );
}

export default ImportPage;