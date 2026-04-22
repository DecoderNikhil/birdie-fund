-- Migration 002: Subscriptions
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null check (status in ('active', 'inactive', 'cancelled', 'lapsed')) default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_stripe_customer_id on subscriptions(stripe_customer_id);