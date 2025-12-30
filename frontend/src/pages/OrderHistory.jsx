import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/istoric-comenzi")
            .then(res => setOrders(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📜 Istoric Comenzi</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Inapoi</button>
            </div>
            <table className="table table-striped shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Angajat</th>
                        <th>Total</th>
                        <th>Metoda Plata</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.idComanda}>
                            <td>#{order.idComanda}</td>
                            <td>{new Date(order.dataComenzii).toLocaleString('ro-RO')}</td>
                            <td>{order.numeAngajat} {order.prenumeAngajat}</td>
                            <td className="fw-bold text-success">{order.total} RON</td>
                            <td><span className={`badge ${order.metodaDePlata === 'card' ? 'bg-info' : 'bg-warning text-dark'}`}>{order.metodaDePlata.toUpperCase()}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;