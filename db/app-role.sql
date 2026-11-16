-- Least-privilege role the Worker connects as. It can write posts, manage
-- sessions and login failures, and only READ users, so nothing the Worker does
-- can create an account or change a password. No DDL, can't drop anything.
-- Run as the database owner, after schema.sql, passing the password in:
--   psql "$OWNER_DATABASE_URL" -v app_password="'<long random password>'" -f db/app-role.sql

do $$
begin
  if not exists (select from pg_roles where rolname = 'blog_app') then
    create role blog_app login;
  end if;
end
$$;

alter role blog_app with login password :app_password;

-- Postgres < 15 lets every role create objects in `public`; close that.
revoke create on schema public from public;
revoke all on schema public from blog_app;
grant usage on schema public to blog_app;

revoke all on all tables in schema public from blog_app;
grant select, insert, update, delete on posts to blog_app;
grant select on users to blog_app;
grant select, insert, delete on sessions to blog_app;
grant select, insert, delete on login_failures to blog_app;
