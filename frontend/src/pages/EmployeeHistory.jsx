import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    // Preluăm datele angajatului logat
    const user = JSON.parse(localStorage.getItem("user"));
    const angajatId = user?.idAngajat || user?.angajat?.idAngajat;

    useEffect(() => {
        if (angajatId) {
            axios.get(`http://localhost:8000/istoric-comenzi/${angajatId}`)
                .then(res => setOrders(res.data))
                .catch(err => console.error("Eroare la preluarea istoricului:", err));
        }
    }, [angajatId]);

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark">🧾 Istoricul Meu de Vânzări</h2>
                    <button className="btn btn-dark shadow-sm" onClick={() => navigate(-1)}>
                        Înapoi la Dashboard
                    </button>
                </div>

                <div className="card shadow border-0 rounded-4">
                    <div className="card-body p-0">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th className="ps-4">ID Comandă</th>
                                    <th>Data și Ora</th>
                                    <th>Metodă Plată</th>
                                    <th className="pe-4 text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <tr key={order.idComanda}>
                                            <td className="ps-4 text-muted">#{order.idComanda}</td>
                                            <td>{new Date(order.dataComenzii).toLocaleString('ro-RO')}</td>
                                            <td>
                                                <span className={`badge ${order.metodaDePlata === 'card' ? 'bg-primary' : 'bg-success'}`}>
                                                    {order.metodaDePlata.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end fw-bold text-dark">{order.total} RON</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            Nu ai nicio comandă înregistrată încă.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeHistory;