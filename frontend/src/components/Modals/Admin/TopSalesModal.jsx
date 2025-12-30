import React from "react";

const TopSalesModal = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
         style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 4000 }}
         onClick={onClose}>
      <div className="bg-white p-4 rounded-4 shadow-lg" 
           style={{ maxWidth: "450px", width: "90%" }}
           onClick={(e) => e.stopPropagation()}>
        <h3 className="fw-bold text-center mb-4">🥇 Top Vanzari</h3>
        <div className="list-group mb-4">
          {data.map((p, index) => (
            <div key={index} className="list-group-item d-flex justify-content-between align-items-center border-0 bg-light mb-2 rounded shadow-sm">
              <span className="fw-bold">{p.denumire}</span>
              <span className="badge bg-primary rounded-pill">{p.total_vandut} buc</span>
            </div>
          ))}
        </div>
        <button className="btn btn-dark w-100 fw-bold py-2" onClick={onClose}>Inchide</button>
      </div>
    </div>
  );
};

export default TopSalesModal;