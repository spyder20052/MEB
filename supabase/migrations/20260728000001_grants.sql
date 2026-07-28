-- ============================================================
-- Grants explicites — les images Postgres récentes de Supabase
-- ne donnent plus automatiquement les droits CRUD aux rôles
-- anon / authenticated / service_role sur les nouvelles tables.
-- La RLS (migration précédente) reste la barrière de sécurité :
-- ces grants ne font qu'autoriser l'accès au niveau SQL.
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

-- Contenu public : lecture pour tous, écriture pour les admins et le serveur.
grant select on public.events, public.projects, public.site_settings to anon;
grant select, insert, update, delete
  on public.events, public.projects, public.site_settings
  to authenticated, service_role;

-- Tables de formulaires : admins (dashboard) et serveur (routes API).
grant select, insert, update, delete
  on public.rdv_requests, public.event_registrations, public.newsletter_subscribers
  to authenticated, service_role;

-- RPC d'inscription : réservée au serveur (routes API).
grant execute on function public.register_for_event(text, text, text, text) to service_role;
