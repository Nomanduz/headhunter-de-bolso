
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles select own" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "Profiles delete own" on public.profiles for delete using (auth.uid() = id);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Assessments
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  overall_level text check (overall_level in ('Júnior','Pleno','Sênior')),
  skills jsonb,
  jobs jsonb,
  courses jsonb,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.assessments enable row level security;

create policy "Assessments select own" on public.assessments for select using (auth.uid() = user_id);
create policy "Assessments insert own" on public.assessments for insert with check (auth.uid() = user_id);
create policy "Assessments update own" on public.assessments for update using (auth.uid() = user_id);
create policy "Assessments delete own" on public.assessments for delete using (auth.uid() = user_id);

create trigger assessments_updated_at before update on public.assessments
  for each row execute function public.set_updated_at();

create index assessments_user_idx on public.assessments(user_id, created_at desc);

-- Answers
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_index int not null,
  question_text text not null,
  answer_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, question_index)
);
alter table public.answers enable row level security;

create policy "Answers select own" on public.answers for select using (auth.uid() = user_id);
create policy "Answers insert own" on public.answers for insert with check (auth.uid() = user_id);
create policy "Answers update own" on public.answers for update using (auth.uid() = user_id);
create policy "Answers delete own" on public.answers for delete using (auth.uid() = user_id);

create trigger answers_updated_at before update on public.answers
  for each row execute function public.set_updated_at();
