export const CHRONO_COLUMN_COUNT = 5 as const;

export type BookEventChronoReveal = {
	index: number;
	type: 'chronoReveal';
	/** Human-readable math outcome tier; it does not determine payout in the frontend. */
	prizeTier: string;
	/** Zero-based index of the visual echo column, in the range 0..4. */
	echoColumn: number;
	/** Set only by the selected book; the frontend must not decide this value. */
	rewind: boolean;
};

export function isChronoRevealEvent(value: unknown): value is BookEventChronoReveal {
	if (typeof value !== 'object' || value === null) return false;

	const event = value as Record<string, unknown>;
	return (
		Number.isInteger(event.index) &&
		(event.index as number) >= 0 &&
		event.type === 'chronoReveal' &&
		typeof event.prizeTier === 'string' &&
		event.prizeTier.trim().length > 0 &&
		Number.isInteger(event.echoColumn) &&
		(event.echoColumn as number) >= 0 &&
		(event.echoColumn as number) < CHRONO_COLUMN_COUNT &&
		typeof event.rewind === 'boolean'
	);
}
