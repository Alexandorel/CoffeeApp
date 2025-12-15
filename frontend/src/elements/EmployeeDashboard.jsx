import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const EmployeeDashboard = () => {
  const [coffees, setCoffees] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // hook ul pentru navigare  
  const navigate = useNavigate();

  // Preluare cafele din backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/cafele")
      .then((res) => {
        setCoffees(res.data);
      })
      .catch((err) =>
        console.error("Eroare la preluarea cafelelor:", err)
      );
  }, []);

  const addToCart = (coffee) => {
    const exists = cart.find((item) => item.idCafea === coffee.idCafea);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.idCafea === coffee.idCafea ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...coffee, quantity: 1 }]);
    }
  };

  const updateQuantity = (idCafea, change) => {
    setCart(
      cart
        .map((item) =>
          item.idCafea === idCafea
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (idCafea) => {
    setCart(cart.filter((i) => i.idCafea !== idCafea));
  };

  const getTotalPrice = () =>
    cart.reduce((s, i) => s + i.pret * i.quantity, 0).toFixed(2);
    
  const placeOrder = () => {
    if (cart.length === 0) return;
    
    console.log("Comanda plasata:", cart);

    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
    }, 3000);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header */}
      <header className="bg-dark text-white py-3 shadow">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          
          {/* Logo și Titlu */}
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "30px" }}>☕</span>
            <h2 className="fw-bold m-0">VintHUB POS - Staff</h2>
          </div>

          {/* Buton Logout */}
          <button 
                onClick={() => navigate('/')}
                className="btn btn-outline-danger fw-bold btn-sm"
            >
                🚪 Logout
          </button>
        </div>
      </header>

      {/* Mesaj Succes */}
      {orderPlaced && (
          <div className="alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg" style={{zIndex: 2000}}>
            ✓ Comanda a fost plasata cu succes!
          </div>
      )}

      {/* Main Content - Layout POS */}
      <div className="container-fluid flex-grow-1 d-flex overflow-hidden">
        <div className="row w-100 m-0">
            
          {/* ================= STANGA: MENIUL DE PRODUSE ================= */}
          <div className="col-md-8 p-4 overflow-auto" style={{height: "calc(100vh - 70px)"}}>
            
            <div className="mb-4">
                <h3 className="fw-bold text-dark">Meniu Cafea</h3>
            </div>

            {/* Grid Produse */}
            <div className="row g-3">
              {coffees.map((coffee) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={coffee.idCafea}>
                  <div 
                    className="card shadow-sm h-100 border-0" 
                    style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                    onClick={() => addToCart(coffee)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div className="text-center p-3 bg-warning bg-opacity-10">
                      <span style={{ fontSize: "50px" }}>☕</span>
                    </div>
                    <div className="card-body p-3 text-center">
                      {/* Mapare date din DB */}
                      <h6 className="card-title fw-bold mb-1">{coffee.denumire}</h6>
                      <small className="text-muted d-block mb-2">{coffee.dimensiune || 'Standard'}</small>
                      <h5 className="text-primary fw-bold mb-0">{coffee.pret} RON</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= DREAPTA: COSUL DE CUMPARATURI ================= */}
          <div className="col-md-4 bg-white border-start shadow-sm d-flex flex-column p-0" style={{height: "calc(100vh - 70px)"}}>
            
            {/* Header Cos */}
            <div className="p-3 bg-light border-bottom">
                <h4 className="fw-bold m-0">🛒 Bon Fiscal</h4>
            </div>

            {/* Lista Produse */}
            <div className="flex-grow-1 overflow-auto p-3">
                {cart.length === 0 ? (
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted opacity-50">
                        <span style={{ fontSize: "60px" }}>🧾</span>
                        <p className="mt-2">Bonul este gol</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.idCafea} className="card mb-2 border-0 shadow-sm bg-light">
                            <div className="card-body p-2 d-flex align-items-center">
                                {/* Cantitate + Butoane */}
                                <div className="d-flex flex-column align-items-center me-3">
                                    <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={(e) => {e.stopPropagation(); updateQuantity(item.idCafea, 1)}}>▲</button>
                                    <span className="fw-bold my-1">{item.quantity}</span>
                                    <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={(e) => {e.stopPropagation(); updateQuantity(item.idCafea, -1)}}>▼</button>
                                </div>

                                {/* Detalii Produs */}
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-bold">{item.denumire}</h6>
                                    <small className="text-muted">{item.pret} RON / buc</small>
                                </div>

                                {/* Total Linie + Sterge */}
                                <div className="text-end">
                                    <div className="fw-bold">{(item.pret * item.quantity).toFixed(2)}</div>
                                    <button className="btn btn-link text-danger p-0 text-decoration-none small" onClick={(e) => {e.stopPropagation(); removeFromCart(item.idCafea)}}>Sterge</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Cos */}
            <div className="p-4 bg-light border-top">
                <div className="d-flex justify-content-between align-items-end mb-3">
                    <span className="text-muted">Total de plata:</span>
                    <h2 className="fw-bold text-success m-0">{getTotalPrice()} RON</h2>
                </div>
                
                <button 
                    className={`btn w-100 py-3 fw-bold ${cart.length === 0 ? 'btn-secondary' : 'btn-success'}`}
                    onClick={placeOrder}
                    disabled={cart.length === 0}
                >
                    ✅ PLASEAZA COMANDA
                </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;