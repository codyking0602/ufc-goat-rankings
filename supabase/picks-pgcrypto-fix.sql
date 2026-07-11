-- Fix for Supabase projects where pgcrypto functions live in the extensions schema.
-- Run once after supabase/picks-schema.sql. Safe to run more than once.

alter function public.picks_create_room(text,text,text)
  set search_path = public, extensions;

alter function public.picks_join_room(text,text)
  set search_path = public, extensions;

alter function public.picks_save_pick(text,text,text,text)
  set search_path = public, extensions;

alter function public.picks_room_snapshot(text,text)
  set search_path = public, extensions;
