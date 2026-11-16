-- Blog schema. Run as the database owner (not the app role):
--   psql "$OWNER_DATABASE_URL" -f db/schema.sql

create table if not exists posts (
  id           integer generated always as identity primary key,
  slug         text not null unique
                 check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  title        text not null check (length(title) between 1 and 200),
  summary      text not null default '' check (length(summary) <= 500),
  body         text not null default '' check (length(body) <= 200000),
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- a published post always has a publish date
  check (status = 'draft' or published_at is not null)
);

create index if not exists posts_published_idx
  on posts (published_at desc)
  where status = 'published';

-- ---- admin auth -------------------------------------------------------------
-- Users can only be created from the console (scripts/create-admin.mjs, run with
-- the owner connection string). The app role can read users but never write them.

create table if not exists users (
  id            integer generated always as identity primary key,
  username      text not null unique check (username ~ '^[a-z0-9_]{3,32}$'),
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Only a SHA-256 of the session token is stored, so a leaked table can't be
-- replayed as cookies.
create table if not exists sessions (
  id         integer generated always as identity primary key,
  token_hash text not null unique,
  user_id    integer not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_expires_idx on sessions (expires_at);

-- Failed logins, for lockout. Cleared for a username on successful login.
create table if not exists login_failures (
  id           integer generated always as identity primary key,
  username     text not null,
  ip           text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists login_failures_username_idx on login_failures (username, attempted_at);
create index if not exists login_failures_ip_idx on login_failures (ip, attempted_at);
