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

// Pornire server
app.listen(port, () => {
    console.log(`Server ascultă pe portul ${port}`);
});
