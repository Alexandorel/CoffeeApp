-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 30, 2025 at 10:45 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafenea2.0`
--

-- --------------------------------------------------------

--
-- Table structure for table `Angajat`
--

CREATE TABLE `Angajat` (
  `idAngajat` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nume` varchar(100) NOT NULL,
  `prenume` varchar(100) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `functie` varchar(255) NOT NULL,
  `dataAngajarii` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Angajat`
--

INSERT INTO `Angajat` (`idAngajat`, `email`, `password`, `nume`, `prenume`, `rol`, `functie`, `dataAngajarii`) VALUES
(1, 'alexandru@gmail.com', 'alexandru', 'Vint', 'Alexandru', 'angajat', 'administrator', '2025-11-11'),
(2, 'admin@gmail.com', 'admin', 'admin', 'admin', 'admin', 'administrator', '2018-12-11'),
(4, 'ana.marin@cafenea.ro', 'adminSecreta', 'Marin', 'Analia', 'admin', 'Manager', '2021-03-15'),
(5, 'mihai.dobre@cafenea.ro', 'parola123', 'Dobre', 'Mihai', 'staff', 'Ospatar', '2022-08-20'),
(9, 'moro@gmail.com', 'moro', 'moro', 'paul', 'staff', 'Barista', '2025-12-11'),
(10, 'test@gmail.com', 'test', 'test', 'test', 'staff', 'Barista', '2025-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `Cafea`
--

CREATE TABLE `Cafea` (
  `idCafea` int(11) NOT NULL,
  `idProdus` int(11) NOT NULL,
  `denumire` varchar(100) NOT NULL,
  `tipBoaba` varchar(50) NOT NULL,
  `origine` varchar(50) NOT NULL,
  `gradulDePrajire` varchar(50) NOT NULL,
  `pret` double NOT NULL,
  `imagine` varchar(255) DEFAULT 'default-coffee.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Cafea`
--

INSERT INTO `Cafea` (`idCafea`, `idProdus`, `denumire`, `tipBoaba`, `origine`, `gradulDePrajire`, `pret`, `imagine`) VALUES
(16, 123, 'Espresso', 'Robusta', 'Columbia', 'Intensă', 6, 'default-coffee.png'),
(17, 124, 'Latte machiatto', 'Robusta', 'Columbia', 'Medie', 10, 'default-coffee.png'),
(18, 125, 'Capuchino', 'Robusta', 'Etiopia', 'Intensa', 12, 'default-coffee.png');

-- --------------------------------------------------------

--
-- Table structure for table `Categorie`
--

CREATE TABLE `Categorie` (
  `idCategorie` int(10) NOT NULL,
  `nume_categorie` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Categorie`
--

INSERT INTO `Categorie` (`idCategorie`, `nume_categorie`) VALUES
(1, 'cafea');

-- --------------------------------------------------------

--
-- Table structure for table `Client`
--

CREATE TABLE `Client` (
  `idClient` int(11) NOT NULL,
  `nume` varchar(100) DEFAULT NULL,
  `prenume` varchar(100) DEFAULT NULL,
  `dateContact` varchar(255) DEFAULT NULL,
  `dataInregistrarii` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Client`
--

INSERT INTO `Client` (`idClient`, `nume`, `prenume`, `dateContact`, `dataInregistrarii`) VALUES
(1, 'Popescu', 'Ion', '0722123456', '2023-01-15'),
(2, 'Ionescu', 'Maria', 'maria@email.com', '2023-02-20'),
(3, 'Radu', 'Andrei', '0744998877', '2023-03-10'),
(4, 'Dumitrescu', 'Elena', 'elena@email.com', '2023-04-05'),
(5, 'Stan', 'Vlad', '0755112233', '2023-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `Comenzi`
--

CREATE TABLE `Comenzi` (
  `idComanda` int(11) NOT NULL,
  `idAngajat` int(11) NOT NULL,
  `dataComenzii` date NOT NULL,
  `total` double NOT NULL,
  `metodaDePlata` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Comenzi`
--

INSERT INTO `Comenzi` (`idComanda`, `idAngajat`, `dataComenzii`, `total`, `metodaDePlata`) VALUES
(1, 2, '2025-12-21', 10, 'cash'),
(2, 2, '2025-12-21', 20, 'cash'),
(3, 2, '2025-12-21', 20, 'cash'),
(4, 2, '2025-12-21', 20, 'cash'),
(5, 2, '2025-12-28', 20, 'card'),
(6, 2, '2025-12-28', 20, 'cash'),
(7, 2, '2025-12-28', 10, 'cash'),
(8, 2, '2025-12-28', 30, 'card'),
(9, 2, '2025-12-28', 10, 'cash'),
(10, 2, '2025-12-28', 6, 'card'),
(11, 2, '2025-12-29', 6, 'cash'),
(12, 2, '2025-12-29', 28, 'cash'),
(13, 2, '2025-12-29', 10, 'cash'),
(14, 2, '2025-12-29', 40, 'cash'),
(15, 1, '2025-12-29', 6, 'card'),
(16, 2, '2025-12-29', 6, 'cash'),
(17, 1, '2025-12-29', 30, 'cash'),
(18, 2, '2025-12-30', 10, 'cash'),
(19, 1, '2025-12-30', 24, 'card');

-- --------------------------------------------------------

--
-- Table structure for table `DetaliiComanda`
--

CREATE TABLE `DetaliiComanda` (
  `idDetaliiComanda` int(11) NOT NULL,
  `idComanda` int(11) NOT NULL,
  `idCafea` int(11) NOT NULL,
  `cantitate` int(11) NOT NULL,
  `pretUnitar` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `DetaliiComanda`
--

INSERT INTO `DetaliiComanda` (`idDetaliiComanda`, `idComanda`, `idCafea`, `cantitate`, `pretUnitar`) VALUES
(53, 10, 16, 1, 6),
(54, 11, 16, 1, 6),
(55, 12, 16, 3, 6),
(59, 15, 16, 1, 6),
(60, 16, 16, 1, 6),
(61, 17, 16, 5, 6),
(62, 18, 17, 1, 10),
(63, 19, 18, 2, 12);

-- --------------------------------------------------------

--
-- Table structure for table `Furnizor`
--

CREATE TABLE `Furnizor` (
  `idFurnizor` int(11) NOT NULL,
  `nume` varchar(255) NOT NULL,
  `taraDeProvenienta` varchar(100) NOT NULL,
  `persoanaDeContact` varchar(255) NOT NULL,
  `dateDeContact` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Furnizor`
--

INSERT INTO `Furnizor` (`idFurnizor`, `nume`, `taraDeProvenienta`, `persoanaDeContact`, `dateDeContact`) VALUES
(1, 'Global Coffee Importers', 'Brazilia', 'Carlos Silva', 'carlos@globalcoffee.com'),
(2, 'Euro Beans Distribution', 'Germania', 'Hans Muller', 'contact@eurobeans.de'),
(3, 'Asian Robusta Traders', 'Vietnam', 'Nguyen Van', 'nguyen@artraders.vn'),
(4, 'Italian Espresso Solutions', 'Italia', 'Marco Rossi', 'marco@espresso.it');

-- --------------------------------------------------------

--
-- Table structure for table `produs`
--

CREATE TABLE `produs` (
  `idProdus` int(11) NOT NULL,
  `nume` varchar(255) NOT NULL,
  `stoc` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produs`
--

INSERT INTO `produs` (`idProdus`, `nume`, `stoc`) VALUES
(123, 'Espresso', 88),
(124, 'Latte machiatto', 3),
(125, 'Capuchino', 42);

-- --------------------------------------------------------

--
-- Table structure for table `ProdusFurnizor`
--

CREATE TABLE `ProdusFurnizor` (
  `idProdus` int(11) NOT NULL,
  `idFurnizor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ProdusFurnizor`
--

INSERT INTO `ProdusFurnizor` (`idProdus`, `idFurnizor`) VALUES
(123, 2),
(124, 3),
(125, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Angajat`
--
ALTER TABLE `Angajat`
  ADD PRIMARY KEY (`idAngajat`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `Cafea`
--
ALTER TABLE `Cafea`
  ADD PRIMARY KEY (`idCafea`),
  ADD KEY `cafea_produs` (`idProdus`);

--
-- Indexes for table `Categorie`
--
ALTER TABLE `Categorie`
  ADD PRIMARY KEY (`idCategorie`);

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD PRIMARY KEY (`idClient`);

--
-- Indexes for table `Comenzi`
--
ALTER TABLE `Comenzi`
  ADD PRIMARY KEY (`idComanda`);

--
-- Indexes for table `DetaliiComanda`
--
ALTER TABLE `DetaliiComanda`
  ADD PRIMARY KEY (`idDetaliiComanda`),
  ADD KEY `fk_detalii_comanda` (`idComanda`),
  ADD KEY `fk_detalii_cafea` (`idCafea`);

--
-- Indexes for table `Furnizor`
--
ALTER TABLE `Furnizor`
  ADD PRIMARY KEY (`idFurnizor`);

--
-- Indexes for table `produs`
--
ALTER TABLE `produs`
  ADD PRIMARY KEY (`idProdus`);

--
-- Indexes for table `ProdusFurnizor`
--
ALTER TABLE `ProdusFurnizor`
  ADD KEY `fk_pf_produs` (`idProdus`),
  ADD KEY `fk_pf_furnizor` (`idFurnizor`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Angajat`
--
ALTER TABLE `Angajat`
  MODIFY `idAngajat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Cafea`
--
ALTER TABLE `Cafea`
  MODIFY `idCafea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `Categorie`
--
ALTER TABLE `Categorie`
  MODIFY `idCategorie` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Comenzi`
--
ALTER TABLE `Comenzi`
  MODIFY `idComanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `DetaliiComanda`
--
ALTER TABLE `DetaliiComanda`
  MODIFY `idDetaliiComanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `produs`
--
ALTER TABLE `produs`
  MODIFY `idProdus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Cafea`
--
ALTER TABLE `Cafea`
  ADD CONSTRAINT `fk_cafea_produs` FOREIGN KEY (`idProdus`) REFERENCES `Produs` (`idProdus`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `DetaliiComanda`
--
ALTER TABLE `DetaliiComanda`
  ADD CONSTRAINT `fk_detalii_cafea` FOREIGN KEY (`idCafea`) REFERENCES `Cafea` (`idCafea`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalii_comanda` FOREIGN KEY (`idComanda`) REFERENCES `Comenzi` (`idComanda`);

--
-- Constraints for table `ProdusFurnizor`
--
ALTER TABLE `ProdusFurnizor`
  ADD CONSTRAINT `fk_pf_furnizor` FOREIGN KEY (`idFurnizor`) REFERENCES `Furnizor` (`idFurnizor`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pf_produs` FOREIGN KEY (`idProdus`) REFERENCES `Produs` (`idProdus`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
