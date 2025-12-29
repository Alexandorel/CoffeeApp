import React from "react";

const PaymentModal = ({ show, onClose, onConfirm, paymentMethod, setPaymentMethod }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}
      onClick={onClose}
    >
      <div 
        className="bg-white p-4 rounded-4 shadow-lg border-0" 
        style={{ maxWidth: "400px", width: "90%" }} 
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-3 fw-bold text-primary">Alege metoda de plată</h4>
        
        <div className="mb-4">
          <label className="form-check p-3 border rounded-3 mb-2 cursor-pointer shadow-sm" style={{ cursor: 'pointer' }}>
            <input 
              type="radio" 
              className="form-check-input" 
              value="cash" 
              checked={paymentMethod === "cash"} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            <span className="form-check-label ms-2 fw-bold text-dark">💵 Numerar (Cash)</span>
          </label>
          
          <label className="form-check p-3 border rounded-3 shadow-sm" style={{ cursor: 'pointer' }}>
            <input 
              type="radio" 
              className="form-check-input" 
              value="card" 
              checked={paymentMethod === "card"} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            <span className="form-check-label ms-2 fw-bold text-dark">💳 Card Bancar</span>
          </label>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-light w-50 py-2 fw-bold" onClick={onClose}>
            Anulează
          </button>
          <button className="btn btn-success w-50 py-2 fw-bold" onClick={onConfirm}>
            Confirmă Plata
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;