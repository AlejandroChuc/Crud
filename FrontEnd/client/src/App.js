import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configura la URL de tu backend
const API_URL = 'http://localhost:5000/api/items';

function App() {
  const [items, setItems] = useState([]);
  const [texto, setTexto] = useState("");
  const [editItem, setEditItem] = useState(null); // Estado para el Modal

  // Cargar datos al iniciar
  const refresh = () => {
    axios.get(API_URL)
      .then(res => setItems(res.data))
      .catch(err => console.error("Error al obtener datos:", err));
  };

  useEffect(() => { refresh(); }, []);

  // Guardar nuevo registro
  const save = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    await axios.post(API_URL, { dato: texto });
    setTexto("");
    refresh();
  };

  // Eliminar registro
  const deleteItem = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      await axios.delete(`${API_URL}/${id}`);
      refresh();
    }
  };

  // Actualizar registro (Modal)
  const update = async () => {
    await axios.put(`${API_URL}/${editItem._id}`, { dato: editItem.dato });
    setEditItem(null); // Cerrar modal
    refresh();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>MERN CRUD Seguro</h1>
      
      {/* 1. Formulario con único punto de inyección */}
      <form onSubmit={save} style={{ marginBottom: '30px' }}>
        <input 
          type="text"
          value={texto} 
          onChange={e => setTexto(e.target.value)} 
          placeholder="Ingrese un dato..." 
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Guardar</button>
      </form>

      {/* 2. Tabla de registros */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Dato</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item._id}>
              <td style={{ padding: '10px' }}>{index + 1}</td>
              <td style={{ padding: '10px' }}>{item.dato}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => setEditItem(item)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => deleteItem(item._id)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 3. Modal de Edición */}
      {editItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', minWidth: '300px' }}>
            <h3>Editar Registro</h3>
            <input 
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              value={editItem.dato} 
              onChange={e => setEditItem({...editItem, dato: e.target.value})} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setEditItem(null)}>Cancelar</button>
              <button onClick={update} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px' }}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; // Único export default al final