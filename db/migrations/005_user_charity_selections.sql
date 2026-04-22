-- Migration 005: User Charity Selection
create table user_charity_selections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade unique not null,
  charity_id uuid references charities(id) not null,
  contribution_percentage integer not null default 10 check (contribution_percentage >= 10 and contribution_percentage <= 100),
  updated_at timestamptz default now()
);

create index idx_user_charity_selections_user_id on user_charity_selections(user_id);
create index idx_user_charity_selections_charity_id on user_charity_selections(charity_id);