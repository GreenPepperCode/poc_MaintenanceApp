-- Création des tables nécessaires
CREATE TABLE IF NOT EXISTS Prestataires (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Nature TEXT NOT NULL,
    Prestataire TEXT NOT NULL,
    Periodicité_Mois INTEGER NOT NULL,
    Site TEXT NOT NULL,
    Batiment TEXT,
    Alias TEXT
);

CREATE TABLE IF NOT EXISTS Interventions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT NOT NULL,
    Nature TEXT NOT NULL,
    Prestataire TEXT NOT NULL,
    Periodicité TEXT NOT NULL,
    Site TEXT NOT NULL,
    Batiment TEXT,
    Alias TEXT,
    Description TEXT
);
