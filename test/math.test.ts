import {expect, test } from 'vitest'
import {Cell, exchange, Generator} from "../src/Components/generator";

let s = new Generator();
s.setNumber(5); // default chosen (0, 0) Cell.
s.setChangeable(0, 0); //modified

test('gene',
    () => {
        s.toString(s.generate(13));
        expect(s.isPositionFirm(0, 0)).toBe(true);
    }
)

test('setFocus', () => {
    expect(s.chosen).toStrictEqual([0, 0]);
    s.setFocus(3, 5);
    expect(s.chosen).toStrictEqual([3, 5]);
})

test('shuffle', () => {
    let a : Cell = ({row: 1, col: 2, val: 3, mod: true});
    let b : Cell = ({row: 1, col: 4, val: 8, mod: false});
    exchange(a, b);
    expect(a.val).toBe(8);
    expect(b.val).toBe(3);
    expect(a.mod).toBe(false);
    expect(b.mod).toBe(true);
    expect(a.row).toBe(1);
    expect(a.col).toBe(2);
})

test('available', () => {
    expect(s.available(0, 0, 5)).toBe(true);
    expect(s.available(1, 1, 5)).toBe(false);
    expect(s.available(2, 2, 5)).toBe(false);
    expect(s.available(7, 0, 5)).toBe(false);
    expect(s.available(0, 8, 5)).toBe(false);
})
