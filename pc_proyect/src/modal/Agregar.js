import React, { useState } from 'react';
import { createPC } from '../apis/Pc';
import '../css-modal/Agregar.css';

function AddModal({ isOpen, onClose, onAdd }) {
  const [newPc, setNewPc] = useState({
    NombrePc: '',
    Modelo: '',
    NSerie: '',
    Teclado: '',
    Mouse: '', 
    Estado: '',
  });

  // Nuevo estado para controlar la disponibilidad del botón de enviar
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPc(prevPc => ({
      ...prevPc,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPc.Estado === '') {
      alert('Por favor, seleccione el estado de la PC.');
      return;
    }

    // Verifica si algún campo esencial está vacío antes de enviar
    if (!newPc.NombrePc || !newPc.Modelo || !newPc.NSerie) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true); // Deshabilita el botón de envío

    try {
      await createPC(newPc);
      alert('PC agregada con éxito');
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error al agregar la PC:', error);
      alert('Ocurrió un error al agregar la PC.');
    } finally {
      setIsSubmitting(false); // Habilita el botón de envío
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`AddModal ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="AddModal-content" onClick={e => e.stopPropagation()}>
        <h2>Agregar Nueva PC</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <input type="text" name="NombrePc" value={newPc.NombrePc} onChange={handleChange} placeholder="Nombre de la PC" />
          <input type="text" name="Modelo" value={newPc.Modelo} onChange={handleChange} placeholder="Modelo" />
          <input type="text" name="NSerie" value={newPc.NSerie} onChange={handleChange} placeholder="Número de Serie" />
          <select name="Teclado" value={newPc.Teclado} onChange={handleChange}>
            <option value="">Seleccione si tiene teclado</option>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
          <select name="Mouse" value={newPc.Mouse} onChange={handleChange}>
            <option value="">Seleccione si tiene mouse</option>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
          <select name="Estado" value={newPc.Estado} onChange={handleChange}>
            <option value="">Seleccione Estado</option>
            <option value="disponible">Disponible</option>
            <option value="nodisponible">No Disponible</option>
            <option value="fueradeservicio">Fuera de Servicio</option>
          </select>
          <button type="submit" disabled={isSubmitting}>Agregar PC</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
