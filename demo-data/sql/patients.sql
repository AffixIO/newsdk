-- Modern relational demo
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  ward TEXT,
  site TEXT,
  episode TEXT
);

INSERT INTO patients (id, status, ward, site, episode) VALUES ('SQL-1001', 'in_ed', 'A&E', 'GGH', 'E-100');
INSERT INTO patients (id, status, ward, site, episode) VALUES ('SQL-1002', 'discharged', 'Ward 7', 'WGH', 'E-101');
INSERT INTO patients (id, status, ward, site, episode) VALUES ('SQL-1003', 'in_ed', 'MAU', 'BGH', 'E-102');

CREATE TABLE IF NOT EXISTS PAS_EPISODE (
  EPISODE_ID TEXT PRIMARY KEY,
  status TEXT,
  ward TEXT,
  site TEXT
);

INSERT INTO PAS_EPISODE (EPISODE_ID, status, ward, site) VALUES ('ORA-01', 'in_ed', 'AE01', 'GGH');
INSERT INTO PAS_EPISODE (EPISODE_ID, status, ward, site) VALUES ('ORA-02', 'waiting', 'OPD', 'WGH');
