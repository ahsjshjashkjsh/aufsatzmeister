-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  is_premium boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Module progress
create table public.module_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  module_id text not null,
  completed boolean default false,
  quiz_score integer,
  completed_at timestamptz,
  unique(user_id, module_id)
);

-- Essay analyses
create table public.essay_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  original_text text not null,
  feedback jsonb not null,
  created_at timestamptz default now()
);

-- Vocabulary progress
create table public.vocab_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  word_id text not null,
  times_seen integer default 0,
  times_correct integer default 0,
  next_review timestamptz default now(),
  unique(user_id, word_id)
);

-- Daily practice streaks
create table public.practice_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_practice_date date
);

-- Monthly essay analysis count (for free tier limit)
create table public.monthly_analysis_count (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  month text not null,
  count integer default 0,
  unique(user_id, month)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;
alter table public.essay_analyses enable row level security;
alter table public.vocab_progress enable row level security;
alter table public.practice_streaks enable row level security;
alter table public.monthly_analysis_count enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own progress" on public.module_progress for all using (auth.uid() = user_id);
create policy "Users can manage own analyses" on public.essay_analyses for all using (auth.uid() = user_id);
create policy "Users can manage own vocab" on public.vocab_progress for all using (auth.uid() = user_id);
create policy "Users can manage own streak" on public.practice_streaks for all using (auth.uid() = user_id);
create policy "Users can manage own count" on public.monthly_analysis_count for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
