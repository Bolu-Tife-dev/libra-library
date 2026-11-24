-- Libra database schema (PostgreSQL / Supabase)
-- Run this file once in the Supabase SQL editor, or let the server apply it on start.
--
-- Access model: the Express server connects with the Postgres connection string
-- (service role), so Row Level Security is intentionally not enabled here. All
-- authorization is enforced in the API. Do NOT expose this connection string
-- to the browser.

CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  copies_total INTEGER NOT NULL DEFAULT 1 CHECK (copies_total >= 0),
  copies_available INTEGER NOT NULL DEFAULT 1 CHECK (copies_available >= 0),
  published_year INTEGER,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  id_card JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE SET NULL,
  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  borrow_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  fine_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned'))
);

CREATE INDEX IF NOT EXISTS idx_borrows_member ON borrow_records(member_id);
CREATE INDEX IF NOT EXISTS idx_borrows_status ON borrow_records(status);

-- Sample catalog. Safe to re-run.
INSERT INTO books (title, author, isbn, category, copies_total, copies_available, published_year, description) VALUES
  ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 3, 2, 1960, 'A timeless novel about justice, empathy, and growing up in the American South.'),
  ('1984', 'George Orwell', '9780452284234', 'Dystopian', 4, 0, 1949, 'A chilling vision of a surveillance state and the struggle for independent thought.'),
  ('The Pragmatic Programmer', 'David Thomas & Andrew Hunt', '9780201616224', 'Technology', 2, 2, 1999, 'Practical advice and habits for becoming a better, more effective developer.'),
  ('Clean Code', 'Robert C. Martin', '9780132350884', 'Technology', 2, 1, 2008, 'A handbook of agile software craftsmanship and readable, maintainable code.'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 3, 3, 1925, 'A portrait of the American Dream and its illusions in the Roaring Twenties.'),
  ('Sapiens', 'Yuval Noah Harari', '9780062316097', 'History', 2, 1, 2011, 'A sweeping history of how Homo sapiens came to dominate the world.'),
  ('Introduction to Algorithms', 'Cormen, Leiserson, Rivest & Stein', '9780262033848', 'Technology', 1, 0, 2009, 'The comprehensive reference on algorithms and data structures.'),
  ('The Hobbit', 'J.R.R. Tolkien', '9780261103344', 'Fantasy', 5, 4, 1937, 'Bilbo Baggins joins a quest to reclaim the lonely mountain.')
ON CONFLICT (isbn) DO NOTHING;
