-- ============================================================
-- MEB — Schéma initial du backend (cf. BACKEND.md)
-- Tables de contenu (events, projects, site_settings),
-- tables de formulaires (rdv_requests, event_registrations,
-- newsletter_subscribers), RLS, RPC d'inscription atomique,
-- bucket de photos et publication realtime.
-- ============================================================

-- ------------------------------------------------------------
-- Table events — remplace la clé localStorage "meb_events"
-- ------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  num text not null unique,
  title text not null,
  tag text not null default '',
  date_str text not null default '',
  recurring_str text not null default '',
  time text not null default '',
  venue text not null default '',
  "desc" text not null default '',
  seats int not null default 0,
  date_raw timestamptz not null default now(),
  is_hidden boolean not null default false,
  template_style text not null default '01' check (template_style in ('01','02','03','04','05')),
  card_photo text,
  recap_published boolean not null default false,
  recap_text text,
  recap_photos text[] not null default '{}',
  recap_attendees int,
  recap_date_str text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Table projects — remplace "meb_projects".
-- id en text pour rester compatible avec les identifiants
-- existants du frontend ("1"…"5", Date.now().toString()).
-- ------------------------------------------------------------
create table public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  sector text not null default '',
  "desc" text not null default '',
  image text not null default '/images/entrepreneur-1.png',
  bg_color text not null default 'bg-green-50 border-green-200 text-green-950',
  tag_color text not null default 'bg-green-100 text-green-700',
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Table site_settings — remplace "meb_hidden_pages".
-- Un seul enregistrement (id = 1 forcé).
-- ------------------------------------------------------------
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  hidden_pages text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Table rdv_requests — formulaire /prendre-rdv (§6.1)
-- ------------------------------------------------------------
create table public.rdv_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp text not null,
  email text,
  service text not null,
  project_description text,
  newsletter boolean not null default false,
  status text not null default 'nouveau' check (status in ('nouveau', 'traité')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Table event_registrations — modale d'inscription /evenements (§6.2)
-- ------------------------------------------------------------
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_num text not null references public.events(num) on delete cascade,
  name text not null,
  whatsapp text not null,
  email text,
  created_at timestamptz not null default now()
);

create index event_registrations_event_num_idx on public.event_registrations(event_num);

-- ------------------------------------------------------------
-- Table newsletter_subscribers — pied de page + case RDV (§6.3)
-- ------------------------------------------------------------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer' check (source in ('footer', 'rdv')),
  confirmed boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS — lecture publique du contenu, écriture réservée aux
-- comptes authentifiés. Les tables de formulaires ne sont
-- accessibles qu'aux admins (les insertions passent par les
-- routes API avec la clé service_role).
-- ============================================================
alter table public.events enable row level security;
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;
alter table public.rdv_requests enable row level security;
alter table public.event_registrations enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Contenu : visible par tous (le masquage est un choix d'affichage,
-- pas une donnée confidentielle — le dashboard doit voir les éléments masqués).
create policy "events_public_read" on public.events
  for select using (true);
create policy "events_admin_write" on public.events
  for all to authenticated using (true) with check (true);

create policy "projects_public_read" on public.projects
  for select using (true);
create policy "projects_admin_write" on public.projects
  for all to authenticated using (true) with check (true);

create policy "site_settings_public_read" on public.site_settings
  for select using (true);
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (true) with check (true);

-- Formulaires : réservés aux admins authentifiés.
create policy "rdv_admin_all" on public.rdv_requests
  for all to authenticated using (true) with check (true);
create policy "registrations_admin_all" on public.event_registrations
  for all to authenticated using (true) with check (true);
create policy "newsletter_admin_all" on public.newsletter_subscribers
  for all to authenticated using (true) with check (true);

-- ============================================================
-- RPC register_for_event — inscription à un événement avec
-- décompte atomique des places : deux inscriptions simultanées
-- sur la dernière place sont départagées par la base (§6.2).
-- ============================================================
create or replace function public.register_for_event(
  p_event_num text,
  p_name text,
  p_whatsapp text,
  p_email text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events%rowtype;
begin
  select * into v_event from public.events where num = p_event_num;

  if not found or v_event.is_hidden then
    return jsonb_build_object('ok', false, 'code', 'introuvable');
  end if;

  -- Décompte atomique : ne passe que s'il reste au moins une place.
  update public.events
     set seats = seats - 1
   where num = p_event_num and seats > 0
   returning * into v_event;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'complet');
  end if;

  insert into public.event_registrations (event_num, name, whatsapp, email)
  values (p_event_num, p_name, p_whatsapp, nullif(p_email, ''));

  return jsonb_build_object(
    'ok', true,
    'event', jsonb_build_object(
      'num', v_event.num,
      'title', v_event.title,
      'dateStr', v_event.date_str,
      'time', v_event.time,
      'venue', v_event.venue,
      'seats', v_event.seats
    )
  );
end;
$$;

-- Seule la clé service_role (routes API) peut appeler la RPC.
revoke execute on function public.register_for_event(text, text, text, text) from public, anon, authenticated;

-- ============================================================
-- Storage — bucket public "event-photos" (lecture publique,
-- écriture réservée aux comptes authentifiés / service_role).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

create policy "event_photos_public_read" on storage.objects
  for select using (bucket_id = 'event-photos');
create policy "event_photos_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'event-photos');
create policy "event_photos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'event-photos');

-- ============================================================
-- Realtime — les visiteurs voient les changements du dashboard
-- en direct (remplace l'événement navigateur "meb_settings_updated").
-- ============================================================
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.site_settings;
