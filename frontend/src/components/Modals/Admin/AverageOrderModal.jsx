import React from "react";

const AverageOrderModal = ({ show, onClose, value }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 4000 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg border-0 text-center"
        style={{ maxWidth: "400px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3">
          <div 
            className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "70px", height: "70px", fontSize: "30px" }}
          >
            📊
          </div>
          <h3 className="fw-bold text-dark">Valoare Medie</h3>
          <p className="text-muted small">Media banilor încasați pe fiecare comandă</p>
        </div>

        <div className="py-3 mb-4 bg-light rounded-3">
          <span className="display-5 fw-bold text-primary">{value}</span>
          <span className="h4 fw-bold text-primary ms-2">RON</span>
        </div>

        <p className="small text-secondary mb-4">
          Acest indicator (AOV) te ajută să înțelegi cât cheltuie, în medie, un client la o vizită în cafenea.
        </p>

        <button className="btn btn-dark w-100 py-2 fw-bold shadow-sm" onClick={onClose}>
          Închide Raportul
        </button>
      </div>
    </div>
  );
};

export default AverageOrderModal;