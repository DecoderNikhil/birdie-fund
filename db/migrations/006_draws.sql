-- Migration 006: Draws
create table draws (
  id uuid default uuid_generate_v4() primary key,
  month integer not null check (month >= 1 and month <= 12),
  year integer not null,
  draw_type text not null check (draw_type in ('random', 'algorithmic')) default 'random',
  drawn_numbers integer[] not null default '{}',
  status text not null check (status in ('pending', 'simulated', 'published')) default 'pending',
  jackpot_amount numeric(10,2) default 0,
  pool_4match numeric(10,2) default 0,
  pool_3match numeric(10,2) default 0,
  total_subscribers integer default 0,
  jackpot_rolled_over boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(month, year)
);

create index idx_draws_month_year on draws(month, year);
create index idx_draws_status on draws(status);