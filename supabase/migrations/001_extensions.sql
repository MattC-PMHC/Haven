-- 001_extensions.sql
-- Enable required PostgreSQL extensions for Haven
--
-- postgis:   Spatial data types (POINT, POLYGON) for cemetery maps
-- pg_trgm:   Trigram-based fuzzy text search (e.g. searching deceased by name)
-- uuid-ossp: UUID generation for primary keys (gen_random_uuid() is built-in,
--            but uuid-ossp gives us uuid_generate_v4() as a fallback)

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
