CREATE TABLE IF NOT EXISTS "book" (
    id SERIAL PRIMARY KEY,
    book_title VARCHAR(255) UNIQUE NOT NULL,
    book_author VARCHAR(100) NOT NULL,
    book_launch DATE NOT NULL,
    book_total INTEGER NOT NULL,
    book_inUse INTEGER,
    publisher_id INTEGER NOT NULL,
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
);