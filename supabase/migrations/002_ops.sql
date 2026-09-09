-- Ops: page views + order shipping fields (idempotent)
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  ua text,
  created_at timestamptz default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);

alter table orders add column if not exists customer_name text;
alter table orders add column if not exists phone text;
alter table orders add column if not exists shipping_address jsonb;
alter table orders add column if not exists shipped_at timestamptz;
alter table orders add column if not exists admin_notes text;
