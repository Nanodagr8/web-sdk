import type { BookEventOfType } from '../../game/typesBookEvent';

const chronoReveal: BookEventOfType<'chronoReveal'> = {
	index: 0,
	type: 'chronoReveal',
	prizeTier: 'temporal',
	echoColumn: 3,
	rewind: true,
};

// This is a Storybook fixture, not an SDK-generated math outcome.
const finalWin: BookEventOfType<'finalWin'> = {
	index: 1,
	type: 'finalWin',
	amount: 1250,
};

export default { chronoReveal, finalWin };
