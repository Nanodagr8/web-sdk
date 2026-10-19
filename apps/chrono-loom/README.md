# Chrono Loom — Stake Engine Frontend Adapter

**Status: draft SDK scaffold only.** This is not an official Stake Engine build, has not been uploaded, has no approved game ID, and must not be used for real-money play.

## What this scaffold does

- Starts from the Web SDK's custom-game `number-picker` example and uses the SDK bet actor rather than generating an outcome in the browser.
- Adds a typed `chronoReveal` book event carrying `prizeTier`, a zero-based `echoColumn` in the range `0..4`, and a book-selected `rewind` flag.
- Animates five **decorative** visual columns. The column display is not scored and does not calculate prizes.
- Passes the standard `finalWin.amount` through for diagnostic display, without currency formatting or local payout calculations.
- Includes Node's built-in test suite for the custom event contract and Storybook fixtures for individual events and a sequence.

## Important schema caveat

The handoff says the official Math SDK generated the 100,000-book candidate and verified its lookup table, but those generated candidate files were not found in the connected repositories or supplied files during this continuation. So the exact `chronoReveal` field names, tier vocabulary, and column-index convention below are a **provisional frontend contract**, not yet verified against the generated `publish_files`.

Before merging this adapter into a candidate for Engine use, compare a representative generated JSONL book and lookup row with `BookEventChronoReveal`, make the smallest necessary field mapping change, and run the existing SDK verifier against the actual candidate. If the math books encode the reveal differently, the adapter must follow the generated books—not the other way around.

## Local checks

Requires the Node and pnpm versions documented in the Web SDK root README.

```powershell
pnpm install
pnpm --filter chrono-loom test
pnpm --filter chrono-loom lint
pnpm --filter chrono-loom build
pnpm --filter chrono-loom storybook
```

The event-contract tests use Node's built-in test runner and TypeScript type stripping supported by the SDK's documented Node version.

## Must be resolved before Engine integration

1. Reconcile the event schema and zero-based column convention with the actual Math SDK-generated books and lookup table.
2. Replace `PENDING_ENGINE_PROVIDER` and `PENDING_ENGINE_GAME_ID` after a game/provider is created in Engine.
3. Replace the inherited sample `max_win: 5000` placeholder with the actual verified maximum payout from the candidate; do not infer the cap from RTP.
4. Confirm the final payout amount's SDK units and currency formatting.
5. Run the full web-sdk lint/build and math verifier, inspect runtime event sequencing, and then conduct the official Engine review.

No Engine upload, real-money RGS session, submission, or approval is part of this branch.
