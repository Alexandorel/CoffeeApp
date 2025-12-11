import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <--- IMPORT NOU

const AddCoffeeForm = ({ onProductAdded }) => {
  const navigate = useNavigate(); // <--- INIȚIALIZARE HOOK

  // State pentru toate câmpurile formularului
  const [formData, setFormData] = useState({
    nume: "",
    tipBoaba: "Arabica",
    origine: "",
    prajire: "Medie",
    pret: "",
    // dimensiune: "1kg",  <-- Șters
    stoc: "",
    idFurnizor: ""
  });

  const [furnizori, setFurnizori] = useState([]);
  const [message, setMessage] = useState(null);

  // Încărcăm lista de furnizori
  useEffect(() => {
    axios.get("http://localhost:8000/furnizori")
      .then((res) => setFurnizori(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.idFurnizor) {
      alert("Te rog selectează un furnizor!");
      return;
    }

    axios.post("http://localhost:8000/adauga-cafea", formData)
      .then((res) => {
        setMessage("Cafea adăugată cu succes! ✅");
        // Resetăm formularul
        setFormData({
            nume: "", tipBoaba: "Arabica", origine: "", 
            prajire: "Medie", pret: "", 
            stoc: "", idFurnizor: ""
        });
        
        if (onProductAdded) onProductAdded();
        
        // Opțional: Te poți întoarce automat după 2 secunde
        setTimeout(() => {
            setMessage(null);
            // navigate("/adminDashboard"); // Decomentează dacă vrei redirect automat
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        alert("Eroare la salvare! Verifică consola.");
      });
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h3 className="mb-3">➕ Adaugă Cafea Nouă</h3>
      
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Furnizor */}
          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">Furnizor (Sursă)</label>
            <select 
              className="form-select" 
              name="idFurnizor" 
              value={formData.idFurnizor} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Selectează Furnizor --</option>
              {furnizori.map((f) => (
                <option key={f.idFurnizor} value={f.idFurnizor}>
                  {f.nume}
                </option>
              ))}
            </select>
          </div>

          {/* Date Produs */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Denumire Produs</label>
            <input type="text" className="form-control" name="nume" placeholder="Ex: Lavazza Gold" value={formData.nume} onChange={handleChange} required />
          </div>

          <div className="col-md-3 mb-3">
             <label className="form-label">Preț (RON)</label>
             <input type="number" step="0.01" className="form-control" name="pret" value={formData.pret} onChange={handleChange} required />
          </div>

          <div className="col-md-3 mb-3">
             <label className="form-label">Stoc Inițial (Buc)</label>
             <input type="number" className="form-control" name="stoc" value={formData.stoc} onChange={handleChange} required />
          </div>

          {/* Detalii Tehnice Cafea */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Tip Boabă</label>
            <select className="form-select" name="tipBoaba" value={formData.tipBoaba} onChange={handleChange}>
              <option value="Arabica">Arabica</option>
              <option value="Robusta">Robusta</option>
              <option value="Amestec">Amestec (Blend)</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Origine</label>
            <input type="text" className="form-control" name="origine" placeholder="Ex: Etiopia" value={formData.origine} onChange={handleChange} required />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Prăjire</label>
            <select className="form-select" name="prajire" value={formData.prajire} onChange={handleChange}>
              <option value="Slabă">Slabă (Light)</option>
              <option value="Medie">Medie</option>
              <option value="Intensă">Intensă (Dark)</option>
            </select>
          </div>
        </div>

        {/* ZONA DE BUTOANE */}
        <div className="d-flex gap-3 mt-3">
            {/* Butonul ÎNAPOI */}
            <button 
                type="button" // Important: type="button" ca să nu facă submit la form
                className="btn btn-secondary w-50"
                onClick={() => navigate("/adminDashboard")}
            >
                ⬅️ Înapoi
            </button>

            {/* Butonul SAVE */}
            <button type="submit" className="btn btn-primary w-50 fw-bold">
                SALVEAZĂ PRODUSUL
            </button>
        </div>

      </form>
    </div>
  );
};

export default AddCoffeeForm;