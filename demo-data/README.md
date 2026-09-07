# Demo databases for NHS-SDK data-check

Used by `test/data-check.test.js` and shipped in the npm package.

## Modern

| Path | Adapter / kind |
|------|----------------|
| `modern/patients.json` | `JsonDocumentStore` / `json` |
| `modern/key-value.json` | `KeyValueStore` / `key_value` |
| `modern/mongo-patients.json` | `MongoDocumentStore` / `mongo` |
| `modern/redis-export.txt` | `RedisExportStore` / `redis` |
| `sql/patients.sql` | `SqlStore` + `InMemorySqlDatabase` / `sql`, `sql_script`, `oracle` table `PAS_EPISODE` |

## Legacy / historic

| Path | Adapter / kind |
|------|----------------|
| `legacy/patients.csv` | `CsvTableStore` / `csv` |
| `legacy/patients.tsv` | `CsvTableStore` / `tsv` |
| `legacy/patients.pipe` | `PipeDelimitedStore` / `pipe` |
| `legacy/patients.scsv` | `DelimitedTableStore` / `semicolon` |
| `legacy/patients.fw` | `FixedWidthStore` (8+8+4+4) |
| `legacy/patients.dbf` | `DbaseStore` / `dbf` |
| `legacy/patients.xml` | `XmlDocumentStore` / `xml` |
| `legacy/patients.ldif` | `LdifStore` / `ldif` |
| `legacy/patients.ini` | `IniSectionStore` / `ini` |

Production SQL (parameterised, timeouts, RO replica):

- `createPgExecutor` / `createMysqlExecutor` / `createOdbcExecutor`
- `createPrimaryReplicaExecutor({ primary, replica, preferReplica })`
- `SqlStore.fromExecutor` + `lookupSql: "... WHERE id = :id"` + optional `bindParams`
- `null` = no row; `SqlLookupError` = infra (`isDbDown`); `lookupOutcome({ catchInfra: true })`
- Recipes: `examples/sql/postgres.mjs`, `mysql.mjs`, `odbc.mjs`
