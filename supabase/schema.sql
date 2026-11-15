-- Flow Guard Database Schema (Supabase / PostgreSQL)

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL UNIQUE,
  status smallint NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policy for Categories (Admin CRUD + Client read via API)
DROP POLICY IF EXISTS "Allow public full access for categories" ON public.categories;
CREATE POLICY "Allow public full access for categories"
ON public.categories
FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Products Table (Hybrid Fixed Core + Flexible JSONB Specifications)
CREATE TABLE IF NOT EXISTS public.products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  sectors jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text NOT NULL DEFAULT '',
  characteristics jsonb NOT NULL DEFAULT '[]'::jsonb,
  operating_limits jsonb NOT NULL DEFAULT '[]'::jsonb,
  extra_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  status smallint NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast category filtering & active status queries
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy for Products (Admin CRUD + Client read via API)
DROP POLICY IF EXISTS "Allow public full access for products" ON public.products;
CREATE POLICY "Allow public full access for products"
ON public.products
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Upload Products Bucket" ON storage.objects;
CREATE POLICY "Public Upload Products Bucket"
ON storage.objects
FOR ALL
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- 4. Client Quote Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text NOT NULL,
  product text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public full access for inquiries" ON public.inquiries;
CREATE POLICY "Allow public full access for inquiries"
ON public.inquiries
FOR ALL
USING (true)
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.inquiries TO anon, authenticated;

-- 5. Single Admin Account Table (Server-only access via DATABASE_URL)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  password_encrypted text DEFAULT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS password_encrypted text DEFAULT NULL;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;





