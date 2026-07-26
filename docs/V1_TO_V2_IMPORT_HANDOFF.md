# V1 to V2 data handoff

This branch exists only to prepare a short-lived encrypted export for Octagon HQ V2.

## Included

- Personal avatar data associated with registered V1 Picks members.
- Find the Leader daily history.
- Completed UFC Picks events before `2026-07-25T00:00:00Z`.
- Resolved winner-bearing fights from those completed events.
- Member selections for those resolved historical fights.

## Excluded

- The unfinished July 25 event and every event at or after the cutoff.
- Upcoming, live, hidden, or otherwise incomplete events.
- Draws, no contests, cancelled fights, and unresolved fights.
- PIN hashes, login attempts, lockout state, member/admin tokens, room secrets, and Supabase credentials.

## Safety

The workflow retrieves production data with the existing repository-held Supabase deployment credential, builds a sanitized JSON payload inside the private runner, encrypts it with an ephemeral X25519/AES-GCM envelope, deletes plaintext, and uploads the encrypted envelope for one day.

Nothing from this branch changes the live V1 app or V1 database. The branch and artifact should be removed after V2 reconciliation.
