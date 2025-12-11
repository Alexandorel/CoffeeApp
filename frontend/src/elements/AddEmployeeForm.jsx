import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployeeForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    password: "",
    rol: "staff", // Default
    functie: "",
    dataAngajarii: new Date().toISOString().split("T")[0], // Data de azi default
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/adauga-angajat", formData)
      .then(() => {
        alert("Angajat adăugat cu succes! ✅");
        navigate("/"); // Te întoarce la Dashboard
      })
      .catch((err) => {
        console.error(err);
        alert("Eroare la salvare! Verifică serverul.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center">👤 Înregistrare Angajat Nou</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Nume si Prenume */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Nume</label>
              <input type="text" className="form-control" name="nume" value={formData.nume} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Prenume</label>
              <input type="text" className="form-control" name="prenume" value={formData.prenume} onChange={handleChange} required />
            </div>

            {/* Email si Parola */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Parolă</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            {/* Detalii Job */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Rol (Permisiuni)</label>
              <select className="form-select" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="staff">Staff (Angajat)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Funcție (Titlu)</label>
              <input type="text" className="form-control" name="functie" placeholder="ex: Barista, Manager" value={formData.functie} onChange={handleChange} required />
            </div>

            <div className="col-md-12 mb-4">
              <label className="form-label">Data Angajării</label>
              <input type="date" className="form-control" name="dataAngajarii" value={formData.dataAngajarii} onChange={handleChange} required />
            </div>
          </div>

          <div className="d-flex gap-3">
            <button type="button" className="btn btn-secondary w-50" onClick={() => navigate("/")}>
              ⬅️ Înapoi
            </button>
            <button type="submit" className="btn btn-primary w-50 fw-bold">
              SALVEAZĂ ANGAJAT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;