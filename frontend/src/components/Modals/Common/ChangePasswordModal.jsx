import React, { useState } from "react";
import axios from "axios";

const ChangePasswordModal = ({ show, onClose, employeeId }) => {
  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:8000/schimba-parola/${employeeId}`, passData);
      alert("Parola a fost schimbata cu succes!");
      setPassData({ oldPassword: "", newPassword: "" });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Eroare la schimbarea parolei");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">Schimbare Parola Cont</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase">Parola Actuala</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  placeholder="Introduceti parola veche"
                  required 
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-uppercase">Noua Parola</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  placeholder="Introduceti noua parola"
                  required 
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>
                Anuleaza
              </button>
              <button type="submit" className="btn btn-warning fw-bold px-4" disabled={loading}>
                {loading ? "Se salvează..." : "Actualizeaza Parola"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;