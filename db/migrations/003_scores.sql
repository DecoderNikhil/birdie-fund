-- Migration 003: Scores
create table scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  score integer not null check (score >= 1 and score <= 45),
  score_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, score_date)
);

create index idx_scores_user_id on scores(user_id);
create index idx_scores_score_date on scores(score_date);

-- Function: enforce rolling 5-score limit
create or replace function enforce_score_limit()
returns trigger as $$
declare
  score_count integer;
  oldest_score_id uuid;
begin
  select count(*) into score_count from scores where user_id = new.user_id;
  if score_count >= 5 then
    select id into oldest_score_id
    from scores
    where user_id = new.user_id
    order by score_date asc
    limit 1;
    delete from scores where id = oldest_score_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger before_score_insert
  before insert on scores
  for each row execute procedure enforce_score_limit();