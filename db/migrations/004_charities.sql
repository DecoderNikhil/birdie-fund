-- Migration 004: Charities
create table charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  long_description text,
  logo_url text,
  banner_url text,
  website_url text,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table charity_events (
  id uuid default uuid_generate_v4() primary key,
  charity_id uuid references charities(id) on delete cascade not null,
  title text not null,
  event_date date not null,
  description text,
  created_at timestamptz default now()
);

create index idx_charities_slug on charities(slug);
create index idx_charities_is_active on charities(is_active);
create index idx_charity_events_charity_id on charity_events(charity_id);