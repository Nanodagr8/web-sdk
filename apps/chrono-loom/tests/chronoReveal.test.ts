import test from 'node:test';
import assert from 'node:assert/strict';

import { CHRONO_COLUMN_COUNT, isChronoRevealEvent } from '../src/game/chronoReveal.ts';

const validEvent = {
	index: 0,
	type: 'chronoReveal',
	prizeTier: 'temporal',
	echoColumn: 2,
	rewind: true,
};

test('accepts a valid chronoReveal event', () => {
	assert.equal(isChronoRevealEvent(validEvent), true);
});

test('accepts the first and last zero-based visual columns', () => {
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: 0 }), true);
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: CHRONO_COLUMN_COUNT - 1 }), true);
});

test('rejects values that are not objects', () => {
	assert.equal(isChronoRevealEvent(null), false);
	assert.equal(isChronoRevealEvent('chronoReveal'), false);
});

test('rejects invalid event indexes and columns', () => {
	assert.equal(isChronoRevealEvent({ ...validEvent, index: -1 }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: -1 }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: CHRONO_COLUMN_COUNT }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: 1.5 }), false);
});

test('rejects incomplete or wrong-typed outcomes', () => {
	assert.equal(isChronoRevealEvent({ ...validEvent, prizeTier: '' }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, rewind: 'yes' }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, type: 'reveal' }), false);
	assert.equal(isChronoRevealEvent({ ...validEvent, echoColumn: '2' }), false);
});
