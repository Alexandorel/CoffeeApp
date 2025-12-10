import React, { useState } from "react";

const EmployeeDashboard = () => {
  const [coffees] = useState([
    { id: 1, name: "Espresso", price: 8, image: "☕", description: "Cafea tare și intensă" },
    { id: 2, name: "Cappuccino", price: 12, image: "🥤", description: "Espresso cu lapte spumat" },
    { id: 3, name: "Latte", price: 13, image: "🍵", description: "Cafea cu mult lapte" },
    { id: 4, name: "Americano", price: 9, image: "☕", description: "Espresso diluat cu apă" },
    { id: 5, name: "Mocha", price: 15, image: "🍫", description: "Cafea cu ciocolată" },
    { id: 6, name: "Macchiato", price: 10, image: "☕", description: "Espresso cu puțin lapte" },
  ]);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (coffee) => {
    const exists = cart.find((item) => item.id === coffee.id);
    if (exists) {
      setCart(cart.map((i) => (i.id === coffee.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { ...coffee, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const getTotalPrice = () => cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const getTotalItems = () => cart.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setShowCart(false);
    }, 3000);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-dark text-white py-4 shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "40px" }}>☕</span>
            <h1 className="fw-bold">Coffee Shop</h1>
          </div>

          <button
            onClick={() => setShowCart(!showCart)}
            className="btn btn-warning position-relative fw-bold"
          >
            🛒 Coș
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
          <div className="alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg">
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
              style={{ width: "350px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Coșul tău</h4>
                <button className="btn-close" onClick={() => setShowCart(false)}></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <div style={{ fontSize: "60px" }}>🛒</div>
                  Coșul tău este gol
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3 bg-light p-2 rounded">
                      <div style={{ fontSize: "40px" }}>{item.image}</div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="fw-bold">{item.name}</h6>
                        <span className="text-warning fw-bold">{item.price} RON</span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-link text-danger fs-4"
                        onClick={() => removeFromCart(item.id)}
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

                    <button className="btn btn-success w-100 py-2" onClick={placeOrder}>
                      💳 Plasează comanda
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Product grid */}
        <h2 className="fw-bold mb-4">Meniul nostru</h2>

        <div className="row g-4">
          {coffees.map((coffee) => (
            <div className="col-12 col-md-6 col-lg-4" key={coffee.id}>
              <div className="card shadow-sm h-100">
                <div className="text-center p-5 bg-warning bg-opacity-25">
                  <span style={{ fontSize: "80px" }}>{coffee.image}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{coffee.name}</h5>
                  <p className="text-muted">{coffee.description}</p>

                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-warning fw-bold">{coffee.price} RON</h4>
                    <button className="btn btn-warning" onClick={() => addToCart(coffee)}>
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

export default EmployeeDashboard;
