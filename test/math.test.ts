import {expect, test } from 'vitest'
import {Sudoku} from '../src/sudoku.ts'

let s = new Sudoku();

test('get row of 1', () => {
    expect(s.getRow(1)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
})

test('get row of 71', () => {
    expect(s.getRow(71)).toStrictEqual([63, 64, 65, 66, 67, 68, 69, 70, 71])
})

test('get col of 1', () => {
    expect(s.getCol(1)).toStrictEqual([1, 10, 19, 28, 37, 46, 55, 64, 73])
})