BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Annuaire (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS Building (
    id INTEGER PRIMARY KEY,
    site TEXT NOT NULL,
    building TEXT NOT NULL,
    alias TEXT    
);

CREATE TABLE IF NOT EXISTS Maintenance (
    id INTEGER PRIMARY KEY,
    nature TEXT,
    provider_id INTEGER,
    periodicity TEXT,
    building_id INTEGER,
    maintenance_date DATE,
    maintenance_time TIME,
    maintenance_period TEXT,
    status TEXT,
    reason TEXT,
    cart_number TEXT, -- NULL si non applicable
    creation_date DATE,
    creation_time TIME,
    modification_date DATE,
    modification_time TIME,
    FOREIGN KEY(provider_id) REFERENCES Annuaire(id),
    FOREIGN KEY(building_id) REFERENCES Building(id)
);

CREATE TABLE IF NOT EXISTS Archives (
    id INTEGER PRIMARY KEY,
    nature TEXT,
    provider_id INTEGER,
    periodicity TEXT,
    building_id INTEGER,
    maintenance_date DATE,
    maintenance_time TIME,
    maintenance_period TEXT,
    status TEXT,
    reason TEXT,
    cart_number TEXT,
    creation_date DATE,
    creation_time TIME,
    modification_date DATE,
    modification_time TIME,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(provider_id) REFERENCES Annuaire(id),
    FOREIGN KEY(building_id) REFERENCES Building(id)
);

COMMIT;
