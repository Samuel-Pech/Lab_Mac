import ReactDOM from 'react-dom';
import '../css-modal/Eliminar.css';
import { deletePc } from '../apis/Pc'; 

const DeletePc = ({ isOpen, pc, onClose, onUpdateList }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await deletePc(pc.ID);
      window.alert('Eliminación realizada');
      window.location.reload(); 
    } catch (error) {
      console.error('Error al eliminar la PC:', error);
    }
  };


  return ReactDOM.createPortal(
    <div className="deletePc-overlay">
      <div className="deletePc-content">
        <div className="deletePc-header">
          <h2>Confirmar Eliminación</h2>
        </div>
        <div className="deletePc-body">
          <p>¿Estás seguro de querer eliminar la siguiente PC?</p>
          <ul>
            <li><strong>Nombre PC:</strong> {pc.NombrePc}</li>
            <li><strong>Modelo:</strong> {pc.Modelo}</li>
            <li><strong>N. Serie:</strong> {pc.NSerie}</li>
            <li><strong>Teclado:</strong> {pc.Teclado ? 'Sí' : 'No'}</li>
            <li><strong>Mouse:</strong> {pc.Mouse ? 'Sí' : 'No'}</li>
          </ul>
          <div className="deleteModal-actions">
            <button onClick={handleDelete} className="deleteModal-confirm">Eliminar</button>
            <button onClick={onClose} className="deleteModal-cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default DeletePc;
