import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [coffees, setCoffees] = useState([]);
  //formularul pentru cart
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  //formularul pentru form ul de adaugare cafele
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoffee, setNewCoffee] = useState({
  denumire: "",
  tipBoaba: "",
  origine: "",
  gradulDePrajire: "",
  dimensiune: "",
  pret: "",
});


  // Preluare cafele din backend
  useEffect(() => {
    axios
      .get("/cafele")
      .then((res) => {
        console.log("Date primite:", res.data); // Pentru debugging
        setCoffees(res.data);
      })
      .catch((err) =>
        console.error("Eroare la preluarea cafelelor:", err)
      );
  }, []);

  const addToCart = (coffee) => {
    // ATENTIE: Folosim idCafea, nu id
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

  // Calculăm totalul folosind 'pret' in loc de 'price'
  const getTotalPrice = () =>
    cart.reduce((s, i) => s + i.pret * i.quantity, 0).toFixed(2);
    
  const getTotalItems = () => cart.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    // Aici vei putea adăuga logica de a trimite comanda în baza de date (POST)
    console.log("Comanda plasată:", cart);

    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setShowCart(false);
    }, 3000);
  };

  const refreshCoffees = () => {
    axios.get("http://localhost:8000/cafele")
      .then((res) => setCoffees(res.data))
      .catch((err) => console.error(err));
};

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-dark text-white py-4 shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "40px" }}></span>
            <h1 className="fw-bold">VintHUB Coffee</h1>
          </div>

          <button
            onClick={() => setShowCart(!showCart)}
            className="btn btn-warning position-relative fw-bold"
          >
             Coș
            {getTotalItems() > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="container py-4">
        {/* Success message */}
        {orderPlaced && (
          <div className="alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg" style={{zIndex: 1050}}>
            ✓ Comanda a fost plasată cu succes!
          </div>
        )}

        {/* Sidebar cart */}
        {showCart && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={() => setShowCart(false)}
            style={{ zIndex: 1000 }}
          >
            <div
              className="bg-white h-100 position-fixed end-0 p-4 shadow-lg"
              style={{ width: "350px", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Coșul tău</h4>
                <button
                  className="btn-close"
                  onClick={() => setShowCart(false)}
                ></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <div style={{ fontSize: "60px" }}>🛒</div>
                  Coșul tău este gol
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.idCafea}
                      className="d-flex align-items-center mb-3 bg-light p-2 rounded"
                    >
                      <div style={{ fontSize: "30px" }}>☕</div>
                      <div className="ms-3 flex-grow-1">
                        {/* Aici afișăm denumirea din DB */}
                        <h6 className="fw-bold">{item.denumire}</h6>
                        <span className="text-warning fw-bold">
                          {item.pret} RON
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.idCafea, -1)}
                        >
                          −
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.idCafea, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-link text-danger fs-4"
                        onClick={() => removeFromCart(item.idCafea)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}

                  <div className="mt-4 border-top pt-3">
                    <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                      <span>Total:</span>
                      <span className="text-success">{getTotalPrice()} RON</span>
                    </div>

                    <button
                      className="btn btn-success w-100 py-2"
                      onClick={placeOrder}
                    >
                      💳 Plasează comanda
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Product grid */}
        <h2 className="fw-bold mb-2">Meniul nostru</h2>

        <div className="mb-5 d-flex justify-content-end">
          {/* Buton Adaugă ANGAJAT */}
          {/* <Link to="/adaugare-angajat" className="btn btn-primary btn-lg shadow fw-bold me-2">
            👤 Adaugă Angajat
          </Link> */}
          {/* Acest buton te duce la ruta definită în App.js */}
          <Link to="/adaugare-cafea" className="btn btn-success btn-lg shadow fw-bold">
            ➕ Adaugă Cafea Nouă
          </Link>
        </div>


        <div className="row g-4">
          {coffees.map((coffee) => (
            <div className="col-12 col-md-6 col-lg-4" key={coffee.idCafea}>
              <div className="card shadow-sm h-100">
                <div className="text-center p-5 bg-warning bg-opacity-25">
                  <span style={{ fontSize: "80px" }}></span>
                </div>
                <div className="card-body d-flex flex-column">
                  {/* Mapare date din DB */}
                  <h5 className="card-title fw-bold">{coffee.denumire}</h5>
                  
                  {/* Construim descrierea din coloanele disponibile */}
                  <p className="text-muted small">
                    {coffee.tipBoaba} | Origine: {coffee.origine} <br/>
                    Prăjire: {coffee.gradulDePrajire} <br/>
                    Cantitate: {coffee.dimensiune}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <h4 className="text-warning fw-bold">{coffee.pret} RON</h4>
                    <button
                      className="btn btn-warning"
                      onClick={() => addToCart(coffee)}
                    >
                      + Adaugă
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;