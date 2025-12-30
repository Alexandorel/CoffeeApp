import React from "react";

const PaymentStatsModal = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 4000 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg border-0"
        style={{ maxWidth: "450px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">💳 Metode de Plata</h3>
          <p className="text-muted">Preferintele clientilor si procente</p>
        </div>

        <div className="mb-4">
          {data.map((stat, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-bold text-uppercase text-secondary">{stat.metodaDePlata}</span>
                <span className="fw-bold">{stat.procent}% <small className="text-muted">({stat.total_utilizari})</small></span>
              </div>
              <div className="progress" style={{ height: "12px", borderRadius: "10px" }}>
                <div
                  className={`progress-bar ${stat.metodaDePlata === 'card' ? 'bg-primary' : 'bg-success'}`}
                  role="progressbar"
                  style={{ width: `${stat.procent}%` }}
                  aria-valuenow={stat.procent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-dark w-100 py-2 fw-bold shadow-sm" onClick={onClose}>
          Inchide Raportul
        </button>
      </div>
    </div>
  );
};

export default PaymentStatsModal;