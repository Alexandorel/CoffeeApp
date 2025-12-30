import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import TopSalesModal from "../components/Modals/Admin/TopSalesModal";
import DailySalesModal from "../components/Modals/Admin/DailySalesModal";
import StaffStatsModal from "../components/Modals/Admin/StaffStatsModal";
import PaymentModal from "../components/Modals/Common/PaymentModal";
import PaymentStatsModal from "../components/Modals/Admin/PaymentStatsModal";
import ProductDetailsModal from "../components/Modals/Common/ProductDetailsModal";
import AverageOrderModal from "../components/Modals/Admin/AverageOrderModal";
import ChangePasswordModal from "../components/Modals/Common/ChangePasswordModal";

const AdminDashboard = () => {
  const [coffees, setCoffees] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  // stari 'top 3 produse'
  const [showTopModal, setShowTopModal] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  // stari top vanzari'
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [dailySales, setDailySales] = useState([]);
  // stari metoda plata favorita
  const [showPaymentStatsModal, setShowPaymentStatsModal] = useState(false);
  const [paymentStats, setPaymentStats] = useState([]);
  // stari top angajati
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffStats, setStaffStats] = useState([]);

  // stare avg valoare comenzi
  const [showAvgModal, setShowAvgModal] = useState(false);
  const [averageValue, setAverageValue] = useState(0);

  // stare schimbare parola
  const [showPassModal, setShowPassModal] = useState(false);

  const navigate = useNavigate();

  // Preluare angajat din localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const angajatId = user?.idAngajat;

  useEffect(() => {
    axios
      .get("http://localhost:8000/cafele")
      .then((res) => setCoffees(res.data))
      .catch((err) => console.error("Eroare la preluarea cafelelor:", err));
  }, []);

  const addToCart = (coffee) => {
    // Verificăm dacă proprietatea stoc există. Dacă e undefined, o considerăm 0 pentru siguranță.
    const stocDisponibil = coffee.stoc !== undefined && coffee.stoc !== null ? coffee.stoc : 0;

    // 1. Verificăm dacă produsul mai are deloc stoc
    if (stocDisponibil <= 0) {
      alert(`Ne pare rău, ${coffee.denumire} nu mai este în stoc!`);
      return;
    }

    const exists = cart.find((item) => item.idCafea === coffee.idCafea);

    if (exists) {
      // 2. Verificăm dacă adăugarea încă unei unități depășește stocul disponibil
      if (exists.quantity >= stocDisponibil) {
        alert(`Nu poți adăuga mai mult de ${stocDisponibil} unități (stoc limitat).`);
        return;
      }

      setCart(
        cart.map((i) =>
          i.idCafea === coffee.idCafea ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      // 3. Adăugăm prima unitate în coș
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

  // Deschide modalul de plată
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  // Confirma comanda cu metoda de plata
  const confirmOrder = async () => {
    // 1. Încercam ambele variante de structura pentru siguranta
    const realAngajatId = user?.idAngajat || user?.angajat?.idAngajat;

    console.log("ID Angajat trimis:", realAngajatId);

    if (!realAngajatId) {
      alert("Eroare: Nu s-a putut identifica angajatul. Te rugăm să te reconectezi.");
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
      const res = await axios.post("http://localhost:8000/comenzi", orderData);

      setOrderPlaced(true);
      setCart([]); // Golește coșul
      setShowPaymentModal(false);

      // ACTUALIZARE VIZUALĂ: Reîncărcăm lista de cafele din baza de date
      const freshCoffees = await axios.get("http://localhost:8000/cafele");
      setCoffees(freshCoffees.data);

      setTimeout(() => setOrderPlaced(false), 3000);
    } catch (err) {
      console.error("Eroare la plasarea comenzii:", err);
    }
  };

  const handleEdit = () => {
    if (selectedCoffee) {
      navigate(`/editare-cafea/${selectedCoffee.idProdus}`);
    }
  };

// Functia de stergere
const handleDelete = async (idProdus, nume) => {
  // Cerem o confirmare inainte de a sterge date din baza de date
  if (window.confirm(`Esti sigur ca vrei sa stergi definitiv produsul "${nume}"?`)) {
    try {
      // Trimitem cererea catre backend
      await axios.delete(`http://localhost:8000/sterge-cafea/${idProdus}`);
      
      // 1. Inchidem modalul
      setSelectedCoffee(null);
      
      // 2. Reincarcam lista de cafele (la fel cum faci la confirmOrder)
      const res = await axios.get("http://localhost:8000/cafele");
      setCoffees(res.data);
      
      alert("Produsul a fost eliminat cu succes!");
    } catch (err) {
      console.error("Eroare la stergere:", err);
      alert("Nu s-a putut sterge produsul. Probabil este inclus in comenzi existente.");
    }
  }
};

  const filteredCoffees = coffees.filter((coffee) =>
    coffee.denumire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/top-vanzari");
      setTopProducts(res.data);
      setShowTopModal(true);
    } catch (err) {
      console.error("Eroare la preluarea topului:", err);
    }
  };

  //functie fetch 'top vanzari'
  const fetchDailySales = async () => {
    try {
      const res = await axios.get("http://localhost:8000/venit-zile");
      setDailySales(res.data);
      setShowSalesModal(true);
    } catch (err) {
      console.error("Eroare la preluarea vânzărilor:", err);
    }
  };

  // functie fetch metoda plata favorita
  const fetchPaymentStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/metoda-plata-favorita");
      setPaymentStats(res.data);
      setShowPaymentStatsModal(true);
    } catch (err) {
      console.error("Eroare la preluarea statisticilor de plată:", err);
    }
  };

  // functie fetcj top angajati
  const fetchStaffStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/top-angajati");
      setStaffStats(res.data);
      setShowStaffModal(true);
    } catch (err) {
      console.error("Eroare la preluarea topului angajaților:", err);
    }
  };

  // functie fetch avg comenzi
  const fetchAverageOrder = async () => {
    try {
      const res = await axios.get("http://localhost:8000/statistici/medie-comanda");
      setAverageValue(res.data.medieComanda);
      setShowAvgModal(true);
    } catch (err) {
      console.error("Eroare la preluarea mediei:", err);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column position-relative">
      {/* detalii produs */}
      {/* În AdminDashboard, isAdmin este true */}
      <ProductDetailsModal
        show={!!selectedCoffee}
        onClose={() => setSelectedCoffee(null)}
        product={selectedCoffee}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={true}
      />

      {/* plata */}
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={confirmOrder}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* Modal top vanzari */}
      <TopSalesModal
        show={showTopModal}
        onClose={() => setShowTopModal(false)}
        data={topProducts}
      />

      {/* Modal Venit pe Zile */}
      <DailySalesModal
        show={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        data={dailySales}
      />

      {/* Modal performanta angajati */}
      <StaffStatsModal
        show={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        data={staffStats}
      />

      <PaymentStatsModal
        show={showPaymentStatsModal}
        onClose={() => setShowPaymentStatsModal(false)}
        data={paymentStats}
      />

      <AverageOrderModal
        show={showAvgModal}
        onClose={() => setShowAvgModal(false)}
        value={averageValue}
      />

      <ChangePasswordModal 
      show={showPassModal} 
      onClose={() => setShowPassModal(false)} 
      employeeId={user?.idAngajat || user?.angajat?.idAngajat}
    />

      {/* Header */}
      <header className="bg-dark text-white py-3 shadow">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <span style={{ fontSize: "30px" }}>☕</span>
          <h2 className="fw-bold m-0">VintHUB POS - Staff</h2>
        </div>
        <div className="d-flex gap-2">
          {/* BUTON SCHIMBARE PAROLA */}
          <button 
            onClick={() => setShowPassModal(true)} 
            className="btn btn-outline-warning fw-bold btn-sm d-flex align-items-center gap-1"
          >
            Parola
          </button>
          <button onClick={() => navigate('/')} className="btn btn-outline-danger fw-bold btn-sm">Logout</button>
        </div>
      </div>
    </header>

      {/* Mesaj succes */}
      {orderPlaced && (
        <div className="alert alert-success text-center position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg" style={{ zIndex: 2000 }}>
          ✓ Comanda a fost plasata cu succes!
        </div>
      )}

      {/* Main content */}
      <div className="container-fluid flex-grow-1 d-flex overflow-hidden">
        <div className="row w-100 m-0">
          {/* Meniu produse */}
          <div className="col-md-8 p-4 overflow-auto" style={{ height: "calc(100vh - 70px)" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark">Cafea</h3>

              <div className="input-group flex-grow-1 mx-4" >
                <span className="input-group-text bg-white border-end-0">
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Caută produs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="dropdown">
                <button
                  className="btn btn-dark dropdown-toggle fw-bold shadow-sm"
                  type="button"
                  id="adminDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Administrare
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="adminDropdown">
                  <li>
                    <Link to="/adaugare-cafea" className="dropdown-item py-2">
                      Produs Nou
                    </Link>
                  </li>
                  <li>
                    <Link to="/gestionare-angajati" className="dropdown-item py-2">
                      Gestionare Angajați
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-success fw-bold" onClick={fetchTopProducts}>
                      Top 3 Vânzări
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-info fw-bold" onClick={fetchDailySales}>
                      Venit pe Zile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-warning fw-bold" onClick={fetchPaymentStats}>
                      Metoda de Plată Favorita
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-dark fw-bold" onClick={fetchAverageOrder}>
                      📊 Medie Bani / Comandă
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-primary fw-bold" onClick={fetchStaffStats}>
                      Top Angajati
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/istoric" className="dropdown-item py-2 text-primary fw-bold">
                      Istoric Comenzi
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row g-3">
              <div className="row g-3">
                {filteredCoffees.map((coffee) => (
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={coffee.idCafea}>
                    <div
                      className="card shadow-sm h-100 border-0 position-relative overflow-hidden"
                      style={{
                        cursor: coffee.stoc > 0 ? "pointer" : "not-allowed",
                        transition: "transform 0.2s"
                      }}
                      // click adaugare produs in cos
                      onClick={() => coffee.stoc > 0 && addToCart(coffee)}
                      onMouseEnter={(e) => coffee.stoc > 0 && (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >

                      {/* stoc critic*/}
                      {coffee.stoc < 5 && coffee.stoc > 0 && (
                        <span
                          className="position-absolute top-0 start-0 m-2 badge rounded-pill bg-danger shadow-sm"
                          style={{ zIndex: 10, fontSize: '0.7rem' }}
                        >
                          Stoc Limitat: {coffee.stoc}
                        </span>
                      )}

                      {/* Butonul de info (ℹ) */}
                      <button
                        className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 shadow-sm rounded-circle border"
                        style={{ width: "32px", height: "32px", zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation(); // OBLIGATORIU: Previne adăugarea în coș când vrei doar detalii
                          setSelectedCoffee(coffee);
                        }}
                      >
                        ℹ
                      </button>

                      {/* Imaginea produsului */}
                      <div className="text-center bg-light" style={{ height: "150px", overflow: "hidden" }}>
                        <img
                          src={coffee.imagine || "/imagini/default-coffee.jpg"}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                            // Dacă stocul e 0, imaginea devine gri
                            filter: coffee.stoc === 0 ? "grayscale(100%) opacity(0.5)" : "none"
                          }}
                          onError={(e) => { e.target.src = "/imagini/default-coffee.jpg"; }}
                        />
                      </div>

                      <div className="card-body p-3 text-center">
                        <h6 className="card-title fw-bold mb-1">{coffee.denumire}</h6>
                        <h5 className={`${coffee.stoc === 0 ? 'text-muted text-decoration-line-through' : 'text-primary'} fw-bold mb-0`}>
                          {coffee.pret} RON
                        </h5>

                        {/* Mesaj pentru stoc epuizat */}
                        {coffee.stoc === 0 && (
                          <div className="mt-1">
                            <span className="badge bg-secondary">Indisponibil</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cos */}
          <div className="col-md-4 bg-white border-start shadow-sm d-flex flex-column p-0" style={{ height: "calc(100vh - 70px)" }}>
            <div className="p-3 bg-light border-bottom">
              <h4 className="fw-bold m-0">Bon Fiscal</h4>
            </div>
            <div className="flex-grow-1 overflow-auto p-3">
              {cart.length === 0 ? (
                <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted opacity-50">
                  <span style={{ fontSize: "60px" }}></span>
                  <p className="mt-2">Bonul este gol</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.idCafea} className="card mb-2 border-0 shadow-sm bg-light">
                    <div className="card-body p-2 d-flex align-items-center">
                      <div className="d-flex flex-column align-items-center me-3">
                        <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={(e) => { e.stopPropagation(); updateQuantity(item.idCafea, 1); }}>▲</button>
                        <span className="fw-bold my-1">{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={(e) => { e.stopPropagation(); updateQuantity(item.idCafea, -1); }}>▼</button>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold">{item.denumire}</h6>
                        <small className="text-muted">{item.pret} RON / buc</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">{(item.pret * item.quantity).toFixed(2)}</div>
                        <button className="btn btn-link text-danger p-0 text-decoration-none small" onClick={(e) => { e.stopPropagation(); removeFromCart(item.idCafea); }}>Sterge</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-light border-top">
              <div className="d-flex justify-content-between align-items-end mb-3">
                <span className="text-muted">Total de plata:</span>
                <h2 className="fw-bold text-success m-0">{getTotalPrice()} RON</h2>
              </div>
              <button
                className={`btn w-100 py-3 fw-bold ${cart.length === 0 ? "btn-secondary" : "btn-success"}`}
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
              >
                PLASEAZA COMANDA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
