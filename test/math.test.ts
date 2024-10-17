import {expect, test } from 'vitest'
import {Generator, shuffle} from "../src/generator";

let s = new Generator();
s.setNumber(0, 0, 5);

test('available', () => {
    expect(s.available(0, 0, 5)).toBe(true);
    expect(s.available(1, 1, 5)).toBe(false);
    expect(s.available(2, 2, 5)).toBe(false);
    expect(s.available(7, 0, 5)).toBe(false);
    expect(s.available(0, 8, 5)).toBe(false);
})

test('shuffle', () => {
    let a = [1, 2, 3, 4, 5]
    shuffle(a)
    expect(a).toBe([1, 2, 3, 4, 5])
})

test('generate', () => {
    expect(s.generate(1)).toBe([1, 3])
})