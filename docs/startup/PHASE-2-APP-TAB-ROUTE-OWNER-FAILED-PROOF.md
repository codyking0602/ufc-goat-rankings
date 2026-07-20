# Phase 2 App Tab Route-Owner Failed Proof

_Last updated: 2026-07-20_

## Status

The first proposed Phase 2 runtime batch is **rejected**.

Do not remove the legacy primary `.tab` activation block from `assets/js/app.js` until a separate architecture batch establishes a canonical recovery-window interaction contract.

No runtime source was changed. No runtime pull request was opened.

## Baseline

- Starting `main`: `b60d487a37bfcc115eafacb5d484625ccbf9e9ca`
- Proof PR: #127
- Exact proof head: `7e964c73927bf2f15da1e0aa2a52f844e600da69`
- Startup Architecture Gate: run #42
- Focused proof artifact digest: `sha256:be7c9738723822fb1de6de96c0543f042fcd864b9982679fccaff02b968df7c4`
- Master tracker record: Issue #102 comment `5022334954`

The proof compared the current baseline against an in-memory candidate that removed only this block:

```js
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
  btn.classList.add('active');
  el(btn.dataset.view).classList.add('active-view');
  refresh();
}));
```

## Normal canonical ownership proof

The baseline and listener-removed candidate were equivalent during normal shell ownership.

The focused full-app comparison proved:

- Home activated once with one active surface and one `octagon-hq:view-change` event;
- Rankings activated once;
- Play activated once;
- Picks activated once;
- Intelligence activated once;
- enabled War Room activated once;
- disabled War Room stayed on Home and emitted no route event;
- Overall, Women, Divisions, and Categories all remained functional;
- leaving Rankings from Categories and returning preserved Categories;
- rapid top-navigation activation produced one event per tap with no lost or duplicate activation;
- programmatic `activateDestination()` remained functional;
- hash-driven `#rankings/women` activation remained functional;
- ranking lists remained rendered;
- search, division filter, reset, fighter-profile open/close, and `refresh()` remained functional;
- Play, Picks, Intelligence, and War Room surfaces remained present;
- temporarily missing shell DOM recovered to one complete canonical Home activation.

Measured normal results were identical between baseline and candidate. The normal path therefore does not justify keeping the duplicate listener.

## Missing or delayed shell proof

The critical proof simulated:

1. a failed first shell script attempt that did not publish `window.UFC_APP_SHELL`;
2. `app.js` evaluation while the shell API was unavailable;
3. the real `product-architecture.js` compatibility facade dynamically requesting the real `octagon-hq-shell.js`;
4. repeated primary-navigation taps while that shell recovery request was held;
5. canonical shell completion;
6. immediate, rapid, programmatic, and hash-driven activation after recovery.

The final recovery-window request was Rankings.

### Current baseline during recovery

The legacy listener handled all five simulated taps, but only as partial DOM mutation:

- active surface: `men`;
- visually active top tab: Rankings;
- `aria-selected`: still Home;
- canonical shell destination: unavailable;
- canonical shell ranking view: unavailable;
- route hash: still `#home`;
- `octagon-hq:view-change` events: 0;
- `refresh()` calls: 5.

This proves the legacy listener is not a valid canonical fallback. It can create a destination surface without matching canonical route state, ARIA state, hash state, or route publication.

### Listener-removed candidate during recovery

The candidate avoided partial navigation:

- active surface: Home;
- selected top tab and ARIA state: Home;
- canonical shell API: unavailable;
- route hash: `#home`;
- route events: 0;
- refresh calls: 0.

However, the attempted Rankings activation was not queued or replayed.

### Canonical recovery result

After the real shell recovered, both baseline and candidate converged cleanly to:

- active surface: Home;
- selected top tab and ARIA state: Home;
- `UFC_APP_SHELL.currentDestination`: `home`;
- `UFC_APP_SHELL.currentRankingView`: `men`;
- route hash: `#home`;
- exactly one `octagon-hq:view-change` event for Home.

The requested Rankings activation was therefore lost in the listener-removed candidate.

Immediately after recovery, all canonical behavior worked:

- one Rankings tap produced one complete Rankings activation;
- six rapid taps produced six route events and ended on Rankings;
- programmatic Picks activation worked once;
- hash-driven Women activation worked once.

## Stop condition reached

The focused proof failed on the required assertion:

> STOP CONDITION: removing the legacy app.js listener loses the primary top-navigation activation attempted while product-architecture shell recovery is in flight.

The isolated runtime batch was stopped before editing `assets/js/app.js`, `scripts/test-startup-contract.mjs`, or the production Startup Architecture Gate.

No shell, fresh-launch, product-architecture, native-shell, share, profile, Picks, Play, War Room, Intelligence, index, ranking, fighter, scoring, generated-data, copy, style, saved-state, service-worker, or notification file was changed.

## Architecture conclusion

Two facts are now proven simultaneously:

1. the `app.js` listener is duplicate ownership and is unsafe as a fallback because it produces partial route state;
2. simply deleting it is also unsafe because the current product-architecture shell-recovery facade does not queue or replay a user activation made while recovery is in flight.

The canonical owner remains `assets/js/octagon-hq-shell.js` through `window.UFC_APP_SHELL`.

## Required next proof

Before retrying the app.js removal, a separate route-recovery architecture batch must define and test one canonical behavior for primary-navigation interaction while the shell is unavailable.

The next proof must establish either:

- a canonical queued/replayed activation request that completes exactly once when `UFC_APP_SHELL` becomes available; or
- an explicit temporary navigation-unavailable state that prevents a tap from being accepted until the shell is ready.

That design must prove:

- no partial DOM-only view switch;
- no stale active or ARIA state;
- no destination surface without matching shell state;
- no lost activation once an interaction is accepted;
- one complete canonical activation after recovery;
- no duplicate route event, hash write, refresh, Play support load, or downstream route effect;
- unchanged disabled War Room fallback and ranking-subview preservation.

Because that proof would require examining or changing the shell-recovery boundary in `product-architecture.js` and/or `octagon-hq-shell.js`, it is outside the isolated app.js listener-removal batch and must not be combined with it.
