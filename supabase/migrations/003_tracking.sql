-- Tracking fields on orders (idempotent; already applied on Supabase)
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists carrier text;
alter table orders add column if not exists tracking_url text;
