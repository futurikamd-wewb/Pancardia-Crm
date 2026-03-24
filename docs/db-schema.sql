-- Starter PostgreSQL schema for Hospital Marketing CRM MVP

create table users (
  id uuid primary key,
  full_name varchar(120) not null,
  email varchar(160) unique not null,
  phone varchar(20),
  role varchar(30) not null,
  is_active boolean not null default true,
  created_at timestamp not null default now()
);

create table lead_sources (
  id uuid primary key,
  name varchar(80) not null unique,
  channel_type varchar(40) not null,
  created_at timestamp not null default now()
);

create table leads (
  id uuid primary key,
  patient_name varchar(120) not null,
  phone varchar(20) not null,
  alternate_phone varchar(20),
  city varchar(80),
  treatment_interest varchar(120),
  source_id uuid references lead_sources(id),
  campaign_name varchar(120),
  assigned_to uuid references users(id),
  status varchar(40) not null,
  pipeline_stage varchar(40) not null default 'Inquiry',
  is_testimonial_eligible boolean not null default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create index leads_phone_idx on leads(phone);
create index leads_status_idx on leads(status);
create index leads_assigned_to_idx on leads(assigned_to);

create table lead_notes (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  added_by uuid references users(id),
  note_text text not null,
  call_outcome varchar(40),
  next_follow_up_at timestamp,
  created_at timestamp not null default now()
);

create table appointments (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  appointment_at timestamp not null,
  doctor_name varchar(120),
  status varchar(40) not null,
  created_by uuid references users(id),
  created_at timestamp not null default now()
);

create table testimonials (
  id uuid primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  request_status varchar(40) not null default 'Pending Request',
  testimonial_type varchar(20),
  consent_status varchar(40) not null default 'Pending',
  approval_status varchar(40) not null default 'Pending',
  publication_status varchar(40) not null default 'Draft',
  requested_at timestamp,
  received_at timestamp,
  approved_at timestamp,
  notes text,
  created_at timestamp not null default now()
);

create table media_assets (
  id uuid primary key,
  testimonial_id uuid references testimonials(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  file_name varchar(160) not null,
  file_type varchar(40) not null,
  file_url text not null,
  department varchar(80),
  treatment_tag varchar(80),
  doctor_tag varchar(80),
  approval_status varchar(40) not null default 'Pending',
  consent_attached boolean not null default false,
  uploaded_by uuid references users(id),
  created_at timestamp not null default now()
);

create table activity_logs (
  id uuid primary key,
  entity_type varchar(40) not null,
  entity_id uuid not null,
  action varchar(60) not null,
  performed_by uuid references users(id),
  meta jsonb,
  created_at timestamp not null default now()
);
