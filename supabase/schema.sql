create table if not exists healthcare_waitlist (
  id                       uuid primary key default gen_random_uuid(),
  first_name               text not null,
  last_name                text not null,
  email                    text not null,
  phone                    text not null,
  healthcare_provider_name text not null,
  role_in_facility         text not null,
  consented_at             timestamptz not null,
  created_at               timestamptz not null default now()
);
