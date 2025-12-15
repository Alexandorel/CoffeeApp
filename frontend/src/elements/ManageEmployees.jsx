import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ManageEmployees = () => {
  const [angajati, setAngajati] = useState([]);
  const navigate = useNavigate();

  // Încărcăm angajații la pornire
  useEffect(() => {
    fetchAngajati();
  }, []);

  const fetchAngajati = () => {
    axios.get("/angajati")
      .then((res) => setAngajati(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    // Confirmare înainte de ștergere
    if (window.confirm("Esti sigur ca vrei sa sșergi acest angajat?")) {
      axios.delete(`/angajati/${id}`)
        .then(() => {
          // Actualizăm lista local (fără refresh la pagină)
          setAngajati(angajati.filter((angajat) => angajat.idAngajat !== id));
        })
        .catch((err) => alert("Eroare la ștergere!"));
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">👥 Gestionare Angajați</h2>
        
        <Link to="/adaugare-angajat" className="btn btn-primary btn-lg shadow fw-bold me-2">
            Adaugare Angajat
        </Link>

      </div>

      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nume</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Functie</th>
                <th>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {angajati.map((angajat) => (
                <tr key={angajat.idAngajat}>
                  <td>{angajat.idAngajat}</td>
                  <td className="fw-bold">
                    {angajat.nume} {angajat.prenume}
                  </td>
                  <td>{angajat.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        angajat.rol === "admin" ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {angajat.rol}
                    </span>
                  </td>
                  <td>{angajat.functie}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(angajat.idAngajat)}
                    >
                        Sterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {angajati.length === 0 && (
            <div className="text-center p-3">Nu exista angajati înregistrati.</div>
          )}
        </div>
      </div>
      <button className="btn btn-secondary mt-2" onClick={() => navigate("/adminDashboard")}>
          Inapoi la Dashboard
        </button>
    </div>
  );
};

export default ManageEmployees;