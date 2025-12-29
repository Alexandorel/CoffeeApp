import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// IMPORTĂ COMPONENTELE COMUNE
import PaymentModal from "../components/Modals/Common/PaymentModal";
import ProductDetailsModal from "../components/Modals/Common/ProductDetailsModal";

const EmployeeDashboard = () => {
  const [coffees, setCoffees] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedCoffee, setSelectedCoffee] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCoffees();
  }, []);

  const fetchCoffees = () => {
    axios
      .get("http://localhost:8000/cafele")
      .then((res) => setCoffees(res.data))
      .catch((err) => console.error("Eroare la preluarea cafelelor:", err));
  };

  // FUNCȚIA ACTUALIZATĂ CU VERIFICARE STOC
  const addToCart = (coffee) => {
    const stocDisponibil = coffee.stoc ?? 0;

    if (stocDisponibil <= 0) {
      alert(`Ne pare rău, ${coffee.denumire} nu mai este în stoc!`);
      return;
    }

    const exists = cart.find((item) => item.idCafea === coffee.idCafea);

    if (exists) {
      if (exists.quantity >= stocDisponibil) {
        alert(`Stoc limitat! Nu poți adăuga mai mult de ${stocDisponibil} unități.`);
        return;
      }
      setCart(cart.map((i) => i.idCafea === coffee.idCafea ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...coffee, quantity: 1 }]);
    }
  };

  const updateQuantity = (idCafea, change) => {
    const itemInCart = cart.find(i => i.idCafea === idCafea);
    const coffeeFromDb = coffees.find(c => c.idCafea === idCafea);
    
    if (change > 0 && itemInCart && coffeeFromDb && itemInCart.quantity >= coffeeFromDb.stoc) {
        alert("Nu poți depăși stocul disponibil!");
        return;
    }

    setCart(cart.map((item) => item.idCafea === idCafea ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (idCafea) => {
    setCart(cart.filter((i) => i.idCafea !== idCafea));
  };

  const getTotalPrice = () => cart.reduce((s, i) => s + i.pret * i.quantity, 0).toFixed(2);
    
  const confirmOrder = async () => {
    const realAngajatId = user?.idAngajat || user?.angajat?.idAngajat;

    if (!realAngajatId) {
      alert("Eroare: Angajatul nu este logat corect.");
      return;
    }

    const orderData = {
      idAngajat: realAngajatId,
      total: parseFloat(getTotalPrice()),
      metodaDePlata: paymentMethod,
      produse: cart.map((item) => ({
        idCafea: item.idCafea,
        cantitate: item.quantity,
        pret: item.pret,
      })),
    };

    try {
      await axios.post("http://localhost:8000/comenzi", orderData);
      setOrderPlaced(true);
      setCart([]);
      setShowPaymentModal(false);
      fetchCoffees(); 
      setTimeout(() => setOrderPlaced(false), 3000);
    } catch (err) {
      console.error("Eroare la plasarea comenzii:", err);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={confirmOrder}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <ProductDetailsModal
        show={!!selectedCoffee}
        onClose={() => setSelectedCoffee(null)}
        product={selectedCoffee}
        isAdmin={false} 
      />

      <header className="bg-dark text-white py-3 shadow">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "30px" }}>☕</span>
            <h2 className="fw-bold m-0">VintHUB POS - Staff</h2>
          </div>
          <button onClick={() => navigate('/')} className="btn btn-outline-danger fw-bold btn-sm">🚪 Logout</button>
        </div>
      </header>

      {orderPlaced && (
          <div className="alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg" style={{zIndex: 2000}}>
            ✓ Comanda a fost plasata cu succes!
          </div>
      )}

      <div className="container-fluid flex-grow-1 d-flex overflow-hidden">
        <div className="row w-100 m-0">
          <div className="col-md-8 p-4 overflow-auto" style={{height: "calc(100vh - 70px)"}}>
            <h3 className="fw-bold text-dark mb-4">Meniu Cafea</h3>
            <div className="row g-3">
              {coffees.map((coffee) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={coffee.idCafea}>
                  <div 
                    className="card shadow-sm h-100 border-0 position-relative overflow-hidden" 
                    style={{
                        cursor: coffee.stoc > 0 ? 'pointer' : 'not-allowed', 
                        transition: 'transform 0.2s'
                    }}
                    onClick={() => coffee.stoc > 0 && addToCart(coffee)}
                    onMouseEnter={(e) => coffee.stoc > 0 && (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {/* ALERTA STOC CRITIC */}
                    {coffee.stoc < 5 && coffee.stoc > 0 && (
                      <span className="position-absolute top-0 start-0 m-2 badge rounded-pill bg-danger shadow-sm" style={{ zIndex: 10 }}>
                        ⚠️ {coffee.stoc} buc.
                      </span>
                    )}

                    <button 
                      className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle border shadow-sm"
                      style={{ zIndex: 11 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedCoffee(coffee); }}
                    >ℹ</button>

                    <div className="text-center bg-light" style={{height: '150px', overflow: 'hidden'}}>
                      <img 
                        src={coffee.imagine || "/imagini/default-coffee.jpg"} 
                        className="w-100 h-100" 
                        style={{
                            objectFit: 'cover',
                            filter: coffee.stoc === 0 ? "grayscale(100%) opacity(0.5)" : "none"
                        }} 
                        onError={(e) => e.target.src="/imagini/default-coffee.jpg"}
                        alt={coffee.denumire}
                      />
                    </div>
                    <div className="card-body p-3 text-center">
                      <h6 className="card-title fw-bold mb-1">{coffee.denumire}</h6>
                      <h5 className={`${coffee.stoc === 0 ? 'text-muted' : 'text-primary'} fw-bold mb-0`}>
                        {coffee.pret} RON
                      </h5>
                      {coffee.stoc === 0 && <small className="text-danger fw-bold">Indisponibil</small>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secțiune Coș */}
          <div className="col-md-4 bg-white border-start shadow-sm d-flex flex-column p-0">
            <div className="p-3 bg-light border-bottom"><h4 className="fw-bold m-0">🛒 Bon Fiscal</h4></div>
            <div className="flex-grow-1 overflow-auto p-3">
                {cart.length === 0 ? (
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted opacity-50">
                        <span style={{ fontSize: "60px" }}>🧾</span><p className="mt-2">Bonul este gol</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.idCafea} className="card mb-2 border-0 shadow-sm bg-light">
                            <div className="card-body p-2 d-flex align-items-center">
                                <div className="d-flex flex-column align-items-center me-3">
                                    <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => updateQuantity(item.idCafea, 1)}>▲</button>
                                    <span className="fw-bold my-1">{item.quantity}</span>
                                    <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => updateQuantity(item.idCafea, -1)}>▼</button>
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0 fw-bold">{item.denumire}</h6>
                                    <small className="text-muted">{item.pret} RON</small>
                                </div>
                                <div className="text-end">
                                    <div className="fw-bold">{(item.pret * item.quantity).toFixed(2)}</div>
                                    <button className="btn btn-link text-danger p-0 text-decoration-none small" onClick={() => removeFromCart(item.idCafea)}>Sterge</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 bg-light border-top">
                <div className="d-flex justify-content-between align-items-end mb-3">
                    <span className="text-muted">Total:</span>
                    <h2 className="fw-bold text-success m-0">{getTotalPrice()} RON</h2>
                </div>
                <button 
                    className={`btn w-100 py-3 fw-bold ${cart.length === 0 ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => setShowPaymentModal(true)}
                    disabled={cart.length === 0}
                >✅ PLASEAZA COMANDA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;