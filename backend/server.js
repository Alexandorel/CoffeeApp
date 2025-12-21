const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// Conexiunea la MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cafenea2.0"
});

db.connect((err) => {
    if (err) {
        console.error("Eroare la conectare la baza de date:", err);
    } else {
        console.log("Conexiunea la baza de date reușită!");
    }
});
// Ruta pentru login
app.post('/logare', (req, res) => {
    const { email, password } = req.body;

    console.log("Date primit    e:", email, password);

    if (!email || !password) {
        return res.status(400).json({ message: "Email și parola sunt obligatorii" });
    }

    const sql = `
        SELECT * 
        FROM Angajat
        WHERE email = ? AND password = ?
    `;

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Eroare SQL:", err);
            return res.status(500).json({ message: "Eroare de server" });
        }

        console.log("Rezultat query:", results);

        if (results.length > 0) {
            res.json({
                message: "Autentificare reușită",
                angajat: results[0]
            });
        } else {
            res.status(401).json({ message: "Email sau parolă incorectă" });
        }
    });
});

//ruta pentru extragerea cafelelor din baza de date
app.get('/cafele', (req, res) => {
    // Folosim JOIN pentru a aduce Stocul (din Produs) si Numele Furnizorului (din Furnizor)
    // LEFT JOIN e important: daca o cafea nu are furnizor setat, vrem totusi sa apara in lista (cu furnizor NULL)
    const sql = `
        SELECT 
            c.idCafea,
            c.idProdus,
            c.denumire,
            c.tipBoaba,
            c.origine,
            c.gradulDePrajire,
            c.pret,
            p.stoc,                -- Aici luam stocul din tabelul Parinte
            f.nume AS numeFurnizor -- Aici luam numele furnizorului si ii dam un alias
        FROM Cafea c
        JOIN Produs p ON c.idProdus = p.idProdus
        LEFT JOIN ProdusFurnizor pf ON p.idProdus = pf.idProdus 
        LEFT JOIN Furnizor f ON pf.idFurnizor = f.idFurnizor
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Eroare la preluarea cafelelor:", err);
            return res.status(500).send("Eroare server");
        }
        res.json(result);
    });
});

//ruta pentru adaugare cafea
// Ruta pentru adaugare cafea
app.post('/adauga-cafea', (req, res) => {
    const { nume, tipBoaba, origine, prajire, pret, stoc, idFurnizor } = req.body;

    console.log("Date primite pentru adăugare:", req.body);

    // Validare minimală
    if (!idFurnizor) {
        return res.status(400).json({ error: "Lipsește idFurnizor!" });
    }

    // PASUL A: Creăm PRODUSUL generic (Tabela Părinte)
    // Aici se generează ID-ul unic (idProdus)
    const sqlProdus = "INSERT INTO Produs (Nume, Stoc) VALUES (?, ?)";
    
    db.query(sqlProdus, [nume, stoc || 0], (err, result) => {
        if (err) {
            console.error("❌ Eroare la inserare Produs:", err);
            return res.status(500).json({ error: "Eroare SQL Produs" });
        }

        const idProdusNou = result.insertId; // ID-ul generat automat (ex: 106)
        console.log("✅ Produs creat cu ID:", idProdusNou);

        // PASUL B: Creăm CAFEAUA (Tabela Copil)
        // ATENȚIE: Am șters coloana 'Dimensiune' și valoarea ei din acest query
        const sqlCafea = "INSERT INTO Cafea (Denumire, TipBoaba, Origine, GradulDePrajire, Pret, idProdus) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sqlCafea, [nume, tipBoaba, origine, prajire, pret, idProdusNou, idFurnizor], (err, result) => {
            if (err) {
                console.error("❌ Eroare la inserare Cafea:", err);
                return res.status(500).json({ error: "Eroare SQL Cafea" });
            }

            // PASUL C: Facem legătura cu FURNIZORUL
            const sqlLink = "INSERT INTO ProdusFurnizor (idProdus, idFurnizor) VALUES (?, ?)";
            
            db.query(sqlLink, [idProdusNou, idFurnizor], (err, result) => {
                if (err) {
                    console.error("❌ Eroare la legare Furnizor:", err);
                    return res.status(500).json({ error: "Eroare SQL Furnizor" });
                }

                console.log("✅ Totul a funcționat perfect!");
                return res.json({ message: "Produs adăugat cu succes!" });
            });
        });
    });
});

//ruta pentru extragerea furnizorilor
app.get('/furnizori', (req, res) => {
    const sql = "SELECT * FROM Furnizor"; 
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/angajati', (req, res) => {
    const sql = "SELECT * FROM Angajat";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Ruta pentru adaugare angajati
app.post('/adauga-angajat', (req, res) => {
    const { email, password, nume, prenume, rol, functie, dataAngajarii } = req.body;

    const sql = "INSERT INTO Angajat (email, password, nume, prenume, rol, functie, dataAngajarii) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [email, password, nume, prenume, rol, functie, dataAngajarii], (err, result) => {
        if (err) {
            console.error("Eroare inserare angajat:", err);
            return res.status(500).json(err);
        }
        res.json({ message: "Angajat adăugat cu succes!" });
    });
});

app.delete('/angajati/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Angajat WHERE idAngajat = ?";
    
    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json("Angajat șters cu succes!");
    });
});

// Ruta pentru plasarea comenzii
app.post('/comenzi', (req, res) => {
  const { idAngajat, total, metodaDePlata, produse } = req.body;

  if (!idAngajat || !total || !metodaDePlata || !produse || !produse.length) {
    return res.status(400).json({ message: "Date incomplete pentru comanda" });
  }

  const sqlComanda = "INSERT INTO Comenzi (idAngajat, total, metodaDePlata, dataComenzii) VALUES (?, ?, ?, NOW())";
  db.query(sqlComanda, [idAngajat, total, metodaDePlata], (err, result) => {
    if (err) {
      console.error("Eroare inserare comanda:", err);
      return res.status(500).json({ message: "Eroare la inserarea comenzii" });
    }

    const idComandaNoua = result.insertId;

    const sqlDetalii = "INSERT INTO DetaliiComanda (idComanda, idCafea, cantitate, pretUnitar) VALUES ?";
    const values = produse.map(p => [idComandaNoua, p.idCafea, p.cantitate, p.pret]);

    db.query(sqlDetalii, [values], (err2) => {
      if (err2) {
        console.error("Eroare inserare detalii comanda:", err2);
        return res.status(500).json({ message: "Eroare la inserarea detaliilor comenzii" });
      }

      res.json({ message: "Comanda plasata cu succes!", idComanda: idComandaNoua });
    });
  });
});


// Pornire server
app.listen(port, () => {
    console.log(`Server ascultă pe portul ${port}`);
});
