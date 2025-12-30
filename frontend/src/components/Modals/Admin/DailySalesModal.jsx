import React from "react";

const DailySalesModal = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 4000 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg border-0"
        style={{ maxWidth: "500px", width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">📊 Raport Vanzari Zilnice</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Data</th>
                <th className="text-center">Comenzi</th>
                <th className="text-end">Total Venit</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{item.data}</td>
                    <td className="text-center">
                      <span className="badge bg-secondary rounded-pill">
                        {item.numar_comenzi}
                      </span>
                    </td>
                    <td className="text-end text-success fw-bold">
                      {item.venit_total.toFixed(2)} RON
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    Nu exista date pentru perioada selectata.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 bg-light rounded-3">
          <small className="text-muted d-block">
            * Datele reflecta ultimele 7 zile de activitate din baza de date.
          </small>
        </div>

        <button className="btn btn-dark w-100 mt-3 py-2 fw-bold" onClick={onClose}>
          Inchide Raportul
        </button>
      </div>
    </div>
  );
};

export default DailySalesModal;