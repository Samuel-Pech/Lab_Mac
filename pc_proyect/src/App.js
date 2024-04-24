import React, { useState, useEffect } from 'react';
import './App.css';
import EditPc from './modal/Editar';
import DeleteModal from './modal/Eliminar';
import AddModal from './modal/Agregar';
import { fetchPCs, updatePc, deletePc, createPC } from './apis/Pc'; 

function App() {
  const [pcs, setPcs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPc, setEditingPc] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPc, setDeletingPc] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = await fetchPCs();
      setPcs(data);
    } catch (error) {
      console.error('Error fetching PCs:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (pc) => {
    setEditingPc(pc);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openDeleteModal = (pc) => {
    setDeletingPc(pc);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddNewPc = async (newPcData) => {
    try {
      await createPC(newPcData);
      fetchData();
      closeAddModal();
    } catch (error) {
      console.error('Error al agregar nueva PC:', error);
    }
  };

  const handleEditSave = async (id, pcData) => {
    try {
      await updatePc(id, pcData);
      fetchData();
      closeEditModal();
    } catch (error) {
      console.error('Error updating PC:', error);
    }
  };

  const handleDeletePc = async () => {
    try {
      await deletePc(deletingPc.ID);
      fetchData();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting PC:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventario PCs</h1>
        <h2>Listado de PCs</h2>
      </header>
      <main>
        <table className="Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre PC</th>
              <th>Modelo</th>
              <th>N. Serie</th>
              <th>Teclado</th>
              <th>Mouse</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>
                <button onClick={() => setShowAddModal(true)}>Agregar PC</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {pcs.map(pc => (
              <tr key={pc.ID}>
                <td>{pc.ID}</td>
                <td>{pc.NombrePc}</td>
                <td>{pc.Modelo}</td>
                <td>{pc['N.Serie']}</td>
                <td>{pc.Teclado}</td>
                <td>{pc.Mouse}</td>
                <td>{pc.Estado}</td>
                <td>
                  <button onClick={() => openEditModal(pc)}>Editar</button>
                  <button onClick={() => openDeleteModal(pc)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditModal && (
          <EditPc
            isOpen={showEditModal}
            onClose={closeEditModal}
            pc={editingPc}
            onUpdate={handleEditSave}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            pc={deletingPc}
            onClose={closeDeleteModal}
            onDelete={handleDeletePc} 
          />
        )}
        {showAddModal && (
          <AddModal
            isOpen={showAddModal}
            onClose={closeAddModal}
            onAdd={handleAddNewPc} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
