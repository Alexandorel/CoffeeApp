import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Inițializăm starea cu șiruri goale pentru a evita erorile de tip "undefined" în input-uri
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    rol: "",
    functie: ""
  });

  // PASUL 1: Când se deschide pagina, luăm datele EXISTENTE din DB
  useEffect(() => {
    axios.get(`http://localhost:8000/angajati/${id}`)
      .then((res) => {
        // Aici populăm formularul cu ce există deja în baza de date
        if (res.data) {
          setFormData({
            nume: res.data.nume || "",
            prenume: res.data.prenume || "",
            email: res.data.email || "",
            rol: res.data.rol || "",
            functie: res.data.functie || ""
          });
        }
      })
      .catch((err) => console.error("Eroare la preluarea datelor:", err));
  }, [id]);

  // Funcție generică pentru a actualiza doar câmpul pe care îl tastezi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Trimitem tot obiectul formData (conține și ce ai modificat, și ce a rămas la fel)
      await axios.put(`http://localhost:8000/editare-angajat/${id}`, formData);
      alert("✅ Modificări salvate!");
      navigate("/gestionare-angajati");
    } catch (err) {
      alert("❌ Eroare la salvare!");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-warning p-3">
              <h4 className="m-0 fw-bold text-dark">📝 Editează profilul lui {formData.nume}</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                {/* Observă atributul 'value={formData.nume}' - acesta afișează data existentă */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Nume</label>
                  <input 
                    type="text" 
                    name="nume"
                    className="form-control" 
                    value={formData.nume} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Prenume</label>
                  <input 
                    type="text" 
                    name="prenume"
                    className="form-control" 
                    value={formData.prenume} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Rol</label>
                  <select 
                    name="rol"
                    className="form-select" 
                    value={formData.rol} 
                    onChange={handleChange}
                  >
                    <option value="angajat">Angajat</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Funcție</label>
                  <input 
                    type="text" 
                    name="functie"
                    className="form-control" 
                    value={formData.functie} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="button" className="btn btn-secondary w-50" onClick={() => navigate(-1)}>
                    Înapoi
                  </button>
                  <button type="submit" className="btn btn-dark w-50 fw-bold">
                    Salvează Modificările
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;