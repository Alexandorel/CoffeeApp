import React from "react";

const StaffStatsModal = ({ show, onClose, data }) => {
  // Daca starea 'show' este false, nu randam nimic
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
          <h4 className="fw-bold m-0">Clasament Vanzari</h4>
          <p className="text-muted small">Performanta echipei pe perioada curenta</p>
        </div>

        <div className="list-group list-group-flush">
          {data && data.length > 0 ? (
            data.map((staff, index) => (
              <div 
                key={index} 
                className="list-group-item d-flex align-items-center py-3 border-0 bg-light rounded-3 mb-2 shadow-sm"
              >
                <div className="me-3 fw-bold text-primary fs-5" style={{ width: "25px" }}>
                  #{index + 1}
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{staff.prenume} {staff.nume}</h6>
                  <small className="text-muted">{staff.numar_comenzi} comenzi procesate</small>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-success">
                    {typeof staff.total_vanzari === 'number' 
                      ? staff.total_vanzari.toFixed(2) 
                      : parseFloat(staff.total_vanzari || 0).toFixed(2)
                    } RON
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">
              Nu exista date despre performanta angajatilor.
            </div>
          )}
        </div>

        <button className="btn btn-dark w-100 mt-3 py-2 fw-bold" onClick={onClose}>
          Inchide
        </button>
      </div>
    </div>
  );
};

export default StaffStatsModal;