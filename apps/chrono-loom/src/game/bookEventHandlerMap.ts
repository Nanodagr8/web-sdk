import type { BookEventHandlerMap } from 'utils-book';

import { eventEmitter } from './eventEmitter';
import { isChronoRevealEvent } from './chronoReveal';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	chronoReveal: async (bookEvent: BookEventOfType<'chronoReveal'>) => {
		if (!isChronoRevealEvent(bookEvent)) {
			throw new TypeError('Invalid chronoReveal book event; refusing to animate an invalid outcome.');
		}
		await eventEmitter.broadcastAsync({ type: 'chronoReveal', data: bookEvent });
	},
	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		await eventEmitter.broadcastAsync({ type: 'finalWin', data: bookEvent });
	},
};
