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
    database: "cafenea"
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
    const sql = "SELECT * FROM Cafea";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

//ruta pentru extragerea furnizorilor
app.get('/furnizori', (req, res) => {
    // Folosește * ca să iei toate coloanele exact cum sunt în baza de date
    const sql = "SELECT * FROM Furnizor"; 
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

//ruta pentru adaugare cafea
// Ruta pentru adaugare cafea (FĂRĂ DIMENSIUNE)
app.post('/adauga-cafea', (req, res) => {
    // 1. Extragem datele (Am scos 'dimensiune' de aici)
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
        
        db.query(sqlCafea, [nume, tipBoaba, origine, prajire, pret, idProdusNou], (err, result) => {
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

// Pornire server
app.listen(port, () => {
    console.log(`Server ascultă pe portul ${port}`);
});
