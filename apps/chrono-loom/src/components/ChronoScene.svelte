<script lang="ts">
	import { waitForTimeout } from 'utils-shared/wait';

	import { getContext } from '../game/context';
	import { CHRONO_COLUMN_COUNT, isChronoRevealEvent } from '../game/chronoReveal';
	import type { BookEventOfType } from '../game/typesBookEvent';

	const context = getContext();
	const columnIndexes = Array.from({ length: CHRONO_COLUMN_COUNT }, (_, index) => index);
	const glyphs = ['⌛', '⧖', '✦', '◷', '∞', '◉', '✧'] as const;

	let outcome = $state<BookEventOfType<'chronoReveal'> | null>(null);
	let rolling = $state(false);
	let revealed = $state(false);
	let rewinding = $state(false);
	let animationGeneration = 0;

	const glyphsForColumn = (column: number) =>
		Array.from({ length: 3 }, (_, row) => glyphs[(column * 3 + row) % glyphs.length]);

	context.eventEmitter.subscribeOnMount({
		chronoReveal: async ({ data }) => {
			if (!isChronoRevealEvent(data)) {
				throw new TypeError('Invalid chronoReveal event received by the visual adapter.');
			}

			const generation = ++animationGeneration;
			outcome = data;
			rolling = true;
			revealed = false;
			rewinding = false;

			await waitForTimeout(620);
			if (generation !== animationGeneration) return;

			rolling = false;
			revealed = true;
			if (!data.rewind) return;

			await waitForTimeout(100);
			if (generation !== animationGeneration) return;

			rewinding = true;
			await waitForTimeout(820);
			if (generation === animationGeneration) rewinding = false;
		},
	});
</script>

<section class="chrono-scene" aria-labelledby="reveal-heading">
	<div class="scene-heading">
		<div>
			<p class="scene-eyebrow">TIME SIGNAL</p>
			<h2 id="reveal-heading">Echo chamber</h2>
		</div>
		<span class="scene-badge">Visual reveal</span>
	</div>

	<div class="columns" aria-hidden="true">
		{#each columnIndexes as column}
			<div
				class="column"
				class:rolling={rolling}
				class:rewinding={rewinding && outcome?.echoColumn === column}
				class:echo-column={revealed && outcome?.echoColumn === column}
			>
				<span class="column-index">0{column + 1}</span>
				<div class="glyph-stack">
					{#each glyphsForColumn(column) as glyph, row}
						<div
							class="glyph"
							class:focused={revealed && outcome?.echoColumn === column && row === 1}
						>
							{glyph}
						</div>
					{/each}
				</div>
				{#if revealed && outcome?.echoColumn === column}
					<span class="echo-marker">ECHO</span>
				{:else}
					<span class="echo-marker placeholder">—</span>
				{/if}
			</div>
		{/each}
	</div>

	<div class="outcome-footer" aria-live="polite">
		{#if outcome && revealed}
			<span>Selected prize tier <strong>{outcome.prizeTier}</strong></span>
			<span>Rewind <strong>{outcome.rewind ? 'shown' : 'not shown'}</strong></span>
		{:else}
			<span>Awaiting the book's <code>chronoReveal</code> event…</span>
		{/if}
	</div>
	<p class="scene-caption">Decorative presentation only. Columns do not score symbols or calculate prizes.</p>
</section>

<style>
	.chrono-scene {
		overflow: hidden;
		padding: clamp(0.9rem, 2.4vw, 1.6rem);
		border: 1px solid rgba(160, 184, 223, 0.2);
		border-radius: 1.2rem;
		background:
			radial-gradient(ellipse at 50% 12%, rgba(121, 240, 223, 0.08), transparent 68%),
			rgba(3, 9, 20, 0.72);
	}

	.scene-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.scene-eyebrow {
		margin-bottom: 0.3rem;
		color: #79f0df;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.19em;
	}

	h2 {
		font-size: clamp(1.15rem, 3vw, 1.55rem);
		letter-spacing: -0.02em;
	}

	.scene-badge {
		padding: 0.35rem 0.6rem;
		border: 1px solid rgba(183, 166, 255, 0.28);
		border-radius: 999px;
		color: #c8bdff;
		font-size: 0.66rem;
		white-space: nowrap;
	}

	.columns {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: clamp(0.35rem, 1.5vw, 0.8rem);
	}

	.column {
		position: relative;
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.55rem 0.25rem 0.65rem;
		border: 1px solid rgba(132, 154, 189, 0.17);
		border-radius: 0.8rem;
		background: linear-gradient(180deg, rgba(28, 39, 64, 0.78), rgba(12, 20, 36, 0.95));
		transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
	}

	.column-index {
		color: #788aa8;
		font-size: 0.6rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
	}

	.glyph-stack {
		display: grid;
		width: 100%;
		gap: 0.4rem;
		justify-items: center;
	}

	.glyph {
		display: grid;
		width: min(100%, 4.25rem);
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgba(128, 150, 186, 0.18);
		border-radius: 0.55rem;
		color: #91a6c6;
		background: rgba(3, 8, 18, 0.7);
		font-size: clamp(1.25rem, 4.5vw, 2.4rem);
		text-shadow: 0 0 12px rgba(121, 240, 223, 0.15);
	}

	.glyph.focused {
		border-color: rgba(121, 240, 223, 0.6);
		color: #e0fff9;
		background: rgba(121, 240, 223, 0.11);
		box-shadow: 0 0 22px rgba(121, 240, 223, 0.14), inset 0 0 16px rgba(121, 240, 223, 0.08);
	}

	.echo-marker {
		min-height: 0.9rem;
		color: #79f0df;
		font-size: 0.58rem;
		font-weight: 900;
		letter-spacing: 0.1em;
	}

	.echo-marker.placeholder {
		color: transparent;
	}

	.column.echo-column {
		border-color: rgba(121, 240, 223, 0.66);
		background: linear-gradient(180deg, rgba(35, 77, 86, 0.6), rgba(12, 20, 36, 0.95));
		box-shadow: 0 0 24px rgba(121, 240, 223, 0.1);
	}

	.column.rolling .glyph-stack {
		animation: symbol-roll 95ms linear infinite;
	}

	.column.rewinding .glyph-stack {
		animation: column-rewind 820ms cubic-bezier(0.55, 0.08, 0.25, 1) both;
	}

	.outcome-footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.7rem 1rem;
		margin-top: 1rem;
		padding-top: 0.9rem;
		border-top: 1px solid rgba(160, 184, 223, 0.14);
		color: #9fb0c8;
		font-size: 0.76rem;
	}

	.outcome-footer strong {
		margin-left: 0.25rem;
		color: #f4f2ff;
		font-weight: 750;
	}

	.outcome-footer code {
		color: #79f0df;
		font-size: 0.74rem;
	}

	.scene-caption {
		margin-top: 0.65rem;
		color: #7789a6;
		font-size: 0.68rem;
		line-height: 1.4;
	}

	@keyframes symbol-roll {
		from { transform: translateY(-18%); }
		to { transform: translateY(18%); }
	}

	@keyframes column-rewind {
		0% { transform: translateY(0); }
		24% { transform: translateY(28%); }
		48% { transform: translateY(-22%); }
		70% { transform: translateY(11%); }
		100% { transform: translateY(0); }
	}

	@media (max-width: 430px) {
		.column {
			padding-inline: 0.1rem;
		}

		.glyph-stack {
			gap: 0.25rem;
		}

		.echo-marker {
			font-size: 0.47rem;
			letter-spacing: 0.04em;
		}

		.outcome-footer {
			font-size: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.column.rolling .glyph-stack,
		.column.rewinding .glyph-stack {
			animation: none;
		}
	}
</style>
