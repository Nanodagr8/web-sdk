<script lang="ts">
	import './app.css';

	import { getContext } from '../game/context';
	import EnableGameActor from './EnableGameActor.svelte';
	import ChronoScene from './ChronoScene.svelte';

	import type { BookEventOfType } from '../game/typesBookEvent';

	const context = getContext();

	type RoundState = 'ready' | 'waiting' | 'settled';
	let roundState = $state<RoundState>('ready');
	let isProcessing = $state(false);
	let finalPayout = $state<number | null>(null);

	function startRound() {
		if (isProcessing) return;

		isProcessing = true;
		roundState = 'waiting';
		finalPayout = null;
		// The SDK actor requests the selected RGS book. The browser does not select an outcome.
		context.eventEmitter.broadcast({ type: 'bet' });
	}

	context.eventEmitter.subscribeOnMount({
		finalWin: ({ data }: { data: BookEventOfType<'finalWin'> }) => {
			finalPayout = data.amount;
			roundState = 'settled';
			isProcessing = false;
		},
	});
</script>

<EnableGameActor />

<main class="chrono-shell" aria-labelledby="game-title">
	<header class="hero">
		<p class="eyebrow">CUSTOM REVEAL GAME · WEB SDK ADAPTER</p>
		<h1 id="game-title">Chrono Loom</h1>
		<p class="subtitle">The Rewind Reel</p>
		<p class="hero-copy">
			A selected book reveals a prize tier and an echo column. If the book calls for a rewind,
			the visual column rewinds after the first reveal. The presentation never alters the result.
		</p>
	</header>

	<ChronoScene />

	<section class="round-controls" aria-label="Round controls">
		<button type="button" onclick={startRound} disabled={isProcessing}>
			{isProcessing ? 'Waiting for the selected book…' : roundState === 'ready' ? 'Request round' : 'Request another round'}
		</button>
		<p>No browser-side outcome sampling. The RGS book must supply the reveal event.</p>
	</section>

	{#if roundState === 'settled' && finalPayout !== null}
		<section class="round-result" aria-live="polite">
			<p class="result-label">Round resolved by the SDK</p>
			<p class="result-value">RGS-reported payout amount: <strong>{finalPayout}</strong></p>
			<p class="result-note">Raw SDK amount only; currency formatting/denomination still needs validation.</p>
		</section>
	{/if}

	<aside class="development-warning" role="note">
		<strong>Development scaffold only — not approved for play.</strong>
		The provider and game IDs are placeholders. The custom event schema must be reconciled with the
		actual Math SDK-generated books, and the max-win cap, build, RGS integration, and Engine review
		must be verified before any upload. Do not use for real-money play.
	</aside>
</main>
