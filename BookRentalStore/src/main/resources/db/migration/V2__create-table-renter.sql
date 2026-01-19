CREATE TABLE IF NOT EXISTS "renter" (
    id SERIAL PRIMARY KEY,
    renter_name VARCHAR(100) NOT NULL,
    renter_email VARCHAR(255) UNIQUE NOT NULL,
    renter_telephone VARCHAR (18) UNIQUE NOT NULL,
    renter_CPF VARCHAR (12) UNIQUE NOT NULL,
    renter_Address VARCHAR (100) NOT NULL
);