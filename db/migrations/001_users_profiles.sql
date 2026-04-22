-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (auth)
create table users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles table (extends users)
create table profiles (
  id uuid references users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster lookups
create index idx_profiles_email on profiles(email);
create index idx_users_email on users(email);