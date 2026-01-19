CREATE TABLE IF NOT EXISTS "publishers" (
    id SERIAL PRIMARY KEY,
    publishers_name VARCHAR(100) NOT NULL,
    publishers_email VARCHAR(255) UNIQUE NOT NULL,
    publishers_telephone VARCHAR (18) UNIQUE NOT NULL,
    publishers_site VARCHAR(100)
);