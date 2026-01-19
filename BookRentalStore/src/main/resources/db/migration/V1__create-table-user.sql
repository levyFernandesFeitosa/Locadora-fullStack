DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'ADMIN',
            'USER'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL
);

