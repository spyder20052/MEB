-- ============================================================
-- Refuse l'inscription à un événement passé.
--
-- register_for_event ne vérifiait que `is_hidden` et le nombre de
-- places : une édition dont la date était dépassée restait donc
-- inscriptible, alors que les listes du site la classent déjà en
-- « édition passée ». Un visiteur arrivant sur la carte pouvait
-- encore valider le formulaire.
--
-- Même règle que `isPastEvent()` côté site : l'événement n'est plus
-- ouvert dès que son récapitulatif est publié OU que sa date est
-- passée. La comparaison se fait à la journée (un événement qui a
-- lieu aujourd'hui reste ouvert jusqu'à la fin de la journée).
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

  -- Édition terminée : récap publié ou date dépassée. `date_raw` est
  -- un timestamptz ; on compare les dates civiles pour laisser
  -- l'événement du jour ouvert jusqu'à minuit.
  if v_event.recap_published
     or v_event.date_raw::date < (now() at time zone 'UTC')::date then
    return jsonb_build_object('ok', false, 'code', 'termine');
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

-- La RPC reste réservée aux routes API (clé service_role).
revoke execute on function public.register_for_event(text, text, text, text) from public, anon, authenticated;
grant execute on function public.register_for_event(text, text, text, text) to service_role;
