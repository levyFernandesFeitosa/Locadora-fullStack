DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rental_status_enum') THEN
        CREATE TYPE rental_status_enum AS ENUM (
            'in_time',
            'rented',
            'returned_with_delay',
            'late'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "rental" (
    id SERIAL PRIMARY KEY,
    renter_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    rental_rentedDate DATE NOT NULL,
    rental_deadline DATE NOT NULL,
    rental_returnDate DATE,
    status rental_status_enum,
    FOREIGN KEY (renter_id) REFERENCES renter(id),
    FOREIGN KEY (book_id) REFERENCES book(id)
);