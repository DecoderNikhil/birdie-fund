-- Migration 007: Draw Entries & Winners
create table draw_entries (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references draws(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  scores_snapshot integer[] not null,
  match_count integer default 0,
  is_winner boolean default false,
  created_at timestamptz default now(),
  unique(draw_id, user_id)
);

create table winners (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references draws(id) not null,
  user_id uuid references profiles(id) not null,
  match_type text not null check (match_type in ('5-match', '4-match', '3-match')),
  prize_amount numeric(10,2) not null,
  verification_status text not null check (verification_status in ('pending', 'submitted', 'approved', 'rejected')) default 'pending',
  proof_url text,
  payment_status text not null check (payment_status in ('pending', 'paid')) default 'pending',
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_draw_entries_draw_id on draw_entries(draw_id);
create index idx_draw_entries_user_id on draw_entries(user_id);
create index idx_winners_draw_id on winners(draw_id);
create index idx_winners_user_id on winners(user_id);