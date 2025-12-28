import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCoffee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        denumire: "", tipBoaba: "", origine: "", gradulDePrajire: "", pret: "", stoc: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:8000/cafele/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/editare-cafea/${id}`, formData);
            alert("Actualizat cu succes!");
            navigate("/adminDashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Editează Produs</h2>
            <form onSubmit={handleSave}>
            <div className="mb-2">
                <label className="form-label fw-bold">Denumire Produs:</label>
                <input className="form-control" value={formData.denumire} onChange={e => setFormData({...formData, denumire: e.target.value})} placeholder="Ex: Espresso" />
            </div>

            <div className="mb-2">
                <label className="form-label fw-bold">Preț (RON):</label>
                <input className="form-control" value={formData.pret} onChange={e => setFormData({...formData, pret: e.target.value})} placeholder="0.00" />
            </div>
            
            <div className="mb-2">
                <label className="form-label fw-bold">Stoc disponibil:</label>
                <input className="form-control" value={formData.stoc} onChange={e => setFormData({...formData, stoc: e.target.value})} placeholder="0" />
            </div>
            
            <button type="submit" className="btn btn-primary w-100 mt-2">Salvează</button>
        </form>
        </div>
    );
};

export default EditCoffee;