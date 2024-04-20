import { clear } from './testWrapper';
import HTTPError from 'http-errors';

describe('1. clear()', () => {
    test('a. Correct Return Type', () => {
        expect(clear()).toStrictEqual({});
    });
});