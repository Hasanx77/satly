-- ============================================================
--  SatıcıAsistan - Supabase / PostgreSQL şeması
--  Supabase panelindeki "SQL Editor"a yapıştırıp çalıştır.
-- ============================================================

-- Kullanıcı profili (auth.users ile 1-1)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free',      -- free | starter | pro | agency
  credits int not null default 5,          -- kalan üretim hakkı
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Üretim kayıtları
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  marketplace text not null,
  input jsonb not null,
  output jsonb not null,
  tokens int default 0,
  created_at timestamptz not null default now()
);

-- Abonelikler
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null,                  -- iyzico | stripe
  plan text not null,
  status text not null default 'active',   -- active | canceled | past_due
  external_id text,
  renews_at timestamptz,
  created_at timestamptz not null default now()
);

-- İndeksler
create index if not exists idx_generations_user on public.generations(user_id, created_at desc);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

-- Yeni kullanıcıda otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Row Level Security (RLS): herkes sadece kendi verisini görsün
-- ============================================================
alter table public.profiles enable row level security;
alter table public.generations enable row level security;
alter table public.subscriptions enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- generations
drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own" on public.generations
  for select using (auth.uid() = user_id);

drop policy if exists "generations_insert_own" on public.generations;
create policy "generations_insert_own" on public.generations
  for insert with check (auth.uid() = user_id);

-- subscriptions
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);
