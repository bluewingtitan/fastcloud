
CREATE TABLE nutzer(
    Versichertennummer INTEGER PRIMARY KEY,
    Vorname VARCHAR(255),
    Nachname VARCHAR(255),
    Geburtsdatum DATE,
    Beruf VARCHAR(255),
    Beitragssatz NUMBER(6,2)
);

CREATE TABLE zusatzleistungsArten(
    Zusatzleistungsnummer INTEGER NOT NULL PRIMARY KEY,
    Beschreibung VARCHAR(255)
);

CREATE TABLE zusatzleistungen(
    Versichertennummer INTEGER,
    Zusatzleistungsnummer INTEGER,
    CONSTRAINT FK_ZusatzleistungNutzer FOREIGN KEY (Versichertennummer)
    REFERENCES Nutzer(Versichertennummer),
    CONSTRAINT FK_ZusatzleistungArten FOREIGN KEY (Zusatzleistungsnummer)
    REFERENCES ZusatzleistungsArten(Zusatzleistungsnummer)
);


CREATE TABLE vorfaelle(
    Vorfallsnummer INTEGER PRIMARY KEY,
    Behandlungsstatus VARCHAR(255),
    Versichertennummer INTEGER,
    CONSTRAINT FK_VorfallNutzer FOREIGN KEY (Versichertennummer)
    REFERENCES Nutzer(Versichertennummer)
);

CREATE TABLE standort(
    StandortId INTEGER PRIMARY KEY,
    Adresse VARCHAR(255)
);

CREATE TABLE leistungen(
    Leistungsnummer INTEGER PRIMARY KEY,
    StandortId INTEGER,
    Vorfallsnummer INTEGER,
    CONSTRAINT FK_LeistungVorfall FOREIGN KEY (Vorfallsnummer)
    REFERENCES vorfaelle(Vorfallsnummer),
    CONSTRAINT FK_LeistungStandort FOREIGN KEY (StandortId)
    REFERENCES standort(StandortId)
);

CREATE TABLE bankverbindungen(
    BankverbindungsID INTEGER PRIMARY KEY,
    IBAN CHAR(22),
    Bankname VARCHAR(255),
    BLZ NUMBER(8),
    BIC VARCHAR(11),
    Versichertennummer INTEGER,
    CONSTRAINT FK_BankverbindungNutzer FOREIGN KEY (Versichertennummer)
    REFERENCES Nutzer(Versichertennummer)
);

CREATE TABLE rechnungen(
    Rechnungsnummer INTEGER PRIMARY KEY,
    Höhe NUMBER(6,2),
    Rechnungsdatum DATE,
    Leistungsnummer INTEGER,
    BankverbindungsID INTEGER,
    CONSTRAINT FK_RechnungBankverbindung FOREIGN KEY (BankverbindungsID)
    REFERENCES bankverbindungen(BankverbindungsID)
);

CREATE TABLE gesundheitszustand(
    Versichertennummer INTEGER,
    Beschreibung VARCHAR(255),
    CONSTRAINT FK_GesundheitszustandNutzer FOREIGN KEY (Versichertennummer)
    REFERENCES Nutzer(Versichertennummer)
);
