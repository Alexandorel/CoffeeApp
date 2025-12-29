import React from "react";

const ProductDetailsModal = ({ show, coffee, onClose, onEdit }) => {
  if (!show || !coffee) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 3000 }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{ maxWidth: "500px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <h4 className="m-0 fw-bold text-primary">Detalii Produs</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="mb-3">
          <p><strong>Denumire:</strong> {coffee.denumire}</p>
          <p><strong>Tip Boaba:</strong> {coffee.tipBoaba || "-"}</p>
          <p><strong>Origine:</strong> {coffee.origine || "-"}</p>
          <p><strong>Grad Prajire:</strong> {coffee.gradulDePrajire || "-"}</p>
          <p><strong>Pret:</strong> {coffee.pret} RON</p>
          <p><strong>Stoc Actual:</strong> {coffee.stoc} buc</p>
          <p><strong>Furnizor:</strong> {coffee.numeFurnizor || "Nespecificat"}</p>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-secondary" onClick={onClose}>Inchide</button>
          <button className="btn btn-warning fw-bold text-dark" onClick={onEdit}>Editeaza</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;