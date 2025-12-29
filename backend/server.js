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

// logare
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

// adaugare cafea
app.post('/adauga-cafea', (req, res) => {
    const { nume, tipBoaba, origine, prajire, pret, stoc, idFurnizor } = req.body;

    console.log("Date primite pentru adăugare:", req.body);

    if (!idFurnizor) {
        return res.status(400).json({ error: "Lipseste idFurnizor!" });
    }

    const sqlProdus = "INSERT INTO Produs (Nume, Stoc) VALUES (?, ?)";
    
    db.query(sqlProdus, [nume, stoc || 0], (err, result) => {
        if (err) {
            console.error("Eroare la inserare Produs:", err);
            return res.status(500).json({ error: "Eroare SQL Produs" });
        }

        const idProdusNou = result.insertId;
        console.log("Produs creat cu ID:", idProdusNou);

        const sqlCafea = "INSERT INTO Cafea (Denumire, TipBoaba, Origine, GradulDePrajire, Pret, idProdus) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sqlCafea, [nume, tipBoaba, origine, prajire, pret, idProdusNou, idFurnizor], (err, result) => {
            if (err) {
                console.error("Eroare la inserare Cafea:", err);
                return res.status(500).json({ error: "Eroare SQL Cafea" });
            }

            const sqlLink = "INSERT INTO ProdusFurnizor (idProdus, idFurnizor) VALUES (?, ?)";
            
            db.query(sqlLink, [idProdusNou, idFurnizor], (err, result) => {
                if (err) {
                    console.error("❌ Eroare la legare Furnizor:", err);
                    return res.status(500).json({ error: "Eroare SQL Furnizor" });
                }

                console.log("Totul a functionat perfect!");
                return res.json({ message: "Produs adaugat cu succes!" });
            });
        });
    });
});


// interogare cafea
app.get('/cafele', (req, res) => {
    const sql = `
        SELECT 
            c.idCafea,
            c.idProdus,
            c.denumire,
            c.tipBoaba,
            c.origine,
            c.gradulDePrajire,
            c.pret,
            c.imagine,
            p.stoc,                
            f.nume AS numeFurnizor
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

// plasare comanda, actualizare stoc
app.post("/comenzi", (req, res) => {
  const { idAngajat, total, metodaDePlata, produse } = req.body;

  // inserare in tabela 'Comenzi'
  const sqlComanda = "INSERT INTO Comenzi (idAngajat, total, metodaDePlata, dataComenzii) VALUES (?, ?, ?, NOW())";

  db.query(sqlComanda, [idAngajat, total, metodaDePlata], (err, result) => {
    if (err) {
      console.error("Eroare la inserarea comenzii:", err);
      return res.status(500).json({ error: "Eroare server la crearea comenzii" });
    }

    const idComanda = result.insertId;

    // pentru fiecare produs din lista, inserare detalii, reducere stoc
    produse.forEach((produs) => {
      // inserare în tabela 'DetaliiComanda'
      const sqlDetalii = "INSERT INTO DetaliiComanda (idComanda, idCafea, cantitate, pretUnitar) VALUES (?, ?, ?, ?)";
      db.query(sqlDetalii, [idComanda, produs.idCafea, produs.cantitate, produs.pret], (errDet) => {
        if (errDet) console.error("Eroare la detalii comanda:", errDet);

        // reducere stoc
        const sqlUpdateStoc = `
          UPDATE Produs 
          SET Stoc = Stoc - ? 
          WHERE idProdus = (SELECT idProdus FROM Cafea WHERE idCafea = ?)
        `;

        db.query(sqlUpdateStoc, [produs.cantitate, produs.idCafea], (errStoc) => {
          if (errStoc) console.error("Eroare la actualizarea stocului:", errStoc);
        });
      });
    });

    res.json({ message: "Comandă plasată cu succes și stoc actualizat!", idComanda });
  });
});

// afisare furnizori
app.get('/furnizori', (req, res) => {
    const sql = "SELECT * FROM Furnizor"; 
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// afisare angajati
app.get('/angajati', (req, res) => {
    const sql = "SELECT * FROM Angajat";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// adaugare angajati
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

// stergere angajati
app.delete('/angajati/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Angajat WHERE idAngajat = ?";
    
    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json("Angajat șters cu succes!");
    });
});

// interogare cafea individuala pentru modificare
app.get('/cafele/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT c.*, p.stoc FROM Cafea c JOIN Produs p ON c.idProdus = p.idProdus WHERE c.idProdus = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// salvare modificari cafea
app.put('/editare-cafea/:id', (req, res) => {
    const idProdus = req.params.id;
    const { denumire, tipBoaba, origine, gradulDePrajire, pret, stoc } = req.body;

    const sqlProdus = "UPDATE Produs SET Nume = ?, Stoc = ? WHERE idProdus = ?";
    
    db.query(sqlProdus, [denumire, stoc, idProdus], (err, result) => {
        if (err) return res.status(500).json({ error: "Eroare la update Produs" });

        const sqlCafea = "UPDATE Cafea SET Denumire = ?, TipBoaba = ?, Origine = ?, GradulDePrajire = ?, Pret = ? WHERE idProdus = ?";
        
        db.query(sqlCafea, [denumire, tipBoaba, origine, gradulDePrajire, pret, idProdus], (err2) => {
            if (err2) return res.status(500).json({ error: "Eroare la update Cafea" });
            res.json({ message: "Produs actualizat cu succes!" });
        });
    });
});

// istoric comenzi
app.get('/istoric-comenzi', (req, res) => {
    const sql = `
        SELECT 
            c.idComanda, 
            c.dataComenzii, 
            c.total, 
            c.metodaDePlata, 
            a.nume AS numeAngajat, 
            a.prenume AS prenumeAngajat
        FROM Comenzi c
        JOIN Angajat a ON c.idAngajat = a.idAngajat
        ORDER BY c.dataComenzii DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Eroare la preluarea istoricului:", err);
            return res.status(500).json({ error: "Eroare server" });
        }
        res.json(results);
    });
});

// Top 3 cele mai vandute produse
app.get('/top-vanzari', (req, res) => {
    const sql = `
        SELECT 
            c.denumire, 
            SUM(dc.cantitate) AS total_vandut
        FROM DetaliiComanda dc
        JOIN Cafea c ON dc.idCafea = c.idCafea
        GROUP BY dc.idCafea
        ORDER BY total_vandut DESC
        LIMIT 3
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server ascultă pe portul ${port}`);
});
