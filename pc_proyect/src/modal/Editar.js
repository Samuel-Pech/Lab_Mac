import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../css-modal/Editar.css';
import { updatePc } from '../apis/Pc';

const EditPc = ({ isOpen, pc, onClose, onUpdate }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const nombrePc = event.target.nombrePc.value;
    const modelo = event.target.modelo.value;
    const nSerie = event.target.nSerie.value;
    const teclado = event.target.teclado.value;
    const mouse = event.target.mouse.value;
    const estado = event.target.estado.value; // Nuevo campo para el estado

    const updatedPc = {
      ID: pc.ID,
      NombrePc: nombrePc,
      Modelo: modelo,
      NSerie: nSerie, 
      Teclado: teclado,
      Mouse: mouse,
      Estado: estado, // Añadir estado al objeto para enviar
    };

    try {
      await updatePc(updatedPc);
      setShowAlert(true);
      onUpdate();
      window.alert('Actualización realizada');
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la PC:', error);
    }

    onClose(); 
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Datos de la PC</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="nombrePc">Nombre PC:</label>
          <input name="nombrePc" type="text" defaultValue={pc.NombrePc} />

          <label htmlFor="modelo">Modelo:</label>
          <input name="modelo" type="text" defaultValue={pc.Modelo} />

          <label htmlFor="nSerie">N. Serie:</label>
          <input name="nSerie" type="text" defaultValue={pc['N.Serie']} />

          <label htmlFor="teclado">Teclado:</label>
          <select name="teclado" defaultValue={pc.Teclado}>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>

          <label htmlFor="mouse">Mouse:</label>
          <select name="mouse" defaultValue={pc.Mouse}>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>

          <label htmlFor="estado">Estado:</label> {/* Nuevo campo para el estado */}
          <select name="estado" defaultValue={pc.Estado}>
            <option value="disponible">Disponible</option>
            <option value="nodisponible">No Disponible</option>
            <option value="fueradeservicio">Fuera de Servicio</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" className="button-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
        {showAlert && (
          <div className="alert">
            <p>¡La PC se actualizó exitosamente!</p>
            <button onClick={() => setShowAlert(false)}>Cerrar</button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default EditPc;
