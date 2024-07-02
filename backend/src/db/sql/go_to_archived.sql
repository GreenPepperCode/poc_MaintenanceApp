-- Script pour archiver les anciennes interventions
INSERT INTO ArchivedInterventions (Date, Nature, Prestataire, Periodicité, Site, Batiment, Alias, Description)
SELECT Date, Nature, Prestataire, Periodicité, Site, Batiment, Alias, Description
FROM Interventions
WHERE Date < date('now', '-1 year');

DELETE FROM Interventions WHERE Date < date('now', '-1 year');
