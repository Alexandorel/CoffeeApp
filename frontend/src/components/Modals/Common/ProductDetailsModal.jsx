import React from "react";

const ProductDetailsModal = ({ show, onClose, product, onEdit, onDelete, isAdmin }) => {
  if (!show || !product) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg border-0"
        style={{ maxWidth: "500px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h4 className="m-0 fw-bold text-primary">☕ Detalii Produs</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="mb-4">
          <div className="row g-2">
            <div className="col-6"><strong>Denumire:</strong></div> <div className="col-6">{product.denumire}</div>
            <div className="col-6"><strong>Tip Boabă:</strong></div> <div className="col-6">{product.tipBoaba || "-"}</div>
            <div className="col-6"><strong>Origine:</strong></div> <div className="col-6">{product.origine || "-"}</div>
            <div className="col-6"><strong>Grad Prăjire:</strong></div> <div className="col-6">{product.gradulDePrajire || "-"}</div>
            <div className="col-6"><strong>Preț:</strong></div> <div className="col-6 text-success fw-bold">{product.pret} RON</div>
            <div className="col-6"><strong>Stoc Actual:</strong></div> 
            <div className={`col-6 fw-bold ${product.stoc < 5 ? 'text-danger' : 'text-dark'}`}>
              {product.stoc} buc
            </div>
            <div className="col-6"><strong>Furnizor:</strong></div> <div className="col-6">{product.numeFurnizor || "Nespecificat"}</div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end border-top pt-3">
          <button className="btn btn-secondary px-4" onClick={onClose}>Închide</button>
          
          {/* GRUPARE CU FRAGMENT PENTRU A EVITA EROAREA */}
          {isAdmin && (
            <>
              <button className="btn btn-warning fw-bold text-dark px-4" onClick={onEdit}>
                Editeaza
              </button>
              <button 
                className="btn btn-danger fw-bold px-4" 
                onClick={() => onDelete(product.idProdus, product.denumire)}
              >
                Sterge
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;