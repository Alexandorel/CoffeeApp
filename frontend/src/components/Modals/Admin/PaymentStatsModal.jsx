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
        style={{ maxWidth: "400px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h4 className="fw-bold m-0">Preferințe Plată</h4>
          <p className="text-muted small">Analiza tranzacțiilor totale</p>
        </div>

        {data.map((stat, index) => (
          <div key={index} className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="fw-bold text-uppercase">{stat.metodaDePlata}</span>
              <span className="text-muted">{stat.procent}% ({stat.total_utilizari})</span>
            </div>
            <div className="progress" style={{ height: "10px" }}>
              <div
                className={`progress-bar ${stat.metodaDePlata === 'card' ? 'bg-primary' : 'bg-success'}`}
                style={{ width: `${stat.procent}%` }}
              ></div>
            </div>
          </div>
        ))}

        <button className="btn btn-dark w-100 mt-2" onClick={onClose}>
          Închide
        </button>
      </div>
    </div>
  );
};

export default PaymentStatsModal;