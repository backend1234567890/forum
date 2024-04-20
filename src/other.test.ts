import { clear } from './testWrapper';

describe('1. clear()', () => {
  test('a. Correct Return Type', () => {
    expect(clear()).toStrictEqual({});
  });
});
