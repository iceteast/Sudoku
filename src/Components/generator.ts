
function sfc32(a: number, b: number, c: number, d: number) {
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

const seedGen = () => (Math.random()*2**32)>>>0;
export const getRand = sfc32(seedGen(), seedGen(), seedGen(), seedGen());

export function shuffle(arr : Cell[]) {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(getRand() * arr.length);
        exchange(arr[i], arr[j]);
    }
}

export function exchange(x: Cell, y: Cell) {
    [x.val, y.val] = [y.val, x.val];
    [x.mod, y.mod] = [y.mod, x.mod];
}

export interface Cell {
    row: number;
    col: number;
    val: number;
    mod: boolean;
}

export class Generator {

    SIZE = 9;
    nums: Cell[][] =
        Array.from(
            { length: this.SIZE },
            (r: number) =>
                Array.from(
                    { length: this.SIZE },
                    (c: number) => ({row: r, col: c, val: 0, mod: false})));

    chosen = [0, 0];            //focused cell

    isHighLight(row: number, col: number) {
        if (this.chosen[0] === row && this.chosen[1] === col) return true;
        return !!(
            this.nums[this.chosen[0]][this.chosen[1]].val &&
            this.nums[this.chosen[0]][this.chosen[1]].val === this.nums[row][col].val
        );
    }

    isPositionFirm(r: number, c: number) {
        return !this.nums[r][c].mod;
    }

    isPositionEmpty(r: number, c: number): boolean {
        return this.nums[r][c].val === 0;
    }

    setNumber(v: number) {
        this.nums[this.chosen[0]][this.chosen[1]].val = {
            [v]: 0,
             0 : v
        }[this.nums[this.chosen[0]][this.chosen[1]].val] ?? this.nums[this.chosen[0]][this.chosen[1]].val;
    }

    setFocus(r: number, c: number) {
        this.chosen = [r, c];
    }

    setChangeable(r: number, c: number) {
        this.nums[r][c].mod = true;
    }

    getNumber(r: number, c: number) {
        return this.nums[r][c].val;
    }

    getRandomNumber = () => Math.floor(getRand() * 9);

    availableFocus(v: number) {
        //ignore all firmly cells
        if (!this.nums[this.chosen[0]][this.chosen[1]].mod) return false;

        return this.available(this.chosen[0], this.chosen[1], v);
    }

    available(r: number, c: number, v: number) {

        //allow to cancel the number
        if (this.nums[r][c].val === v) return true;

        //calc the left-top coordinate of block
        let x = Math.floor(r / 3) * 3;
        let y = Math.floor(c / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.nums[x + i][y + j].val === v) return false;
            }
        }

        //same number in row & col
        for (let i = 0; i < this.SIZE; i++) {
            if (this.nums[r][i].val === v || this.nums[i][c].val === v) {
                return false;
            }
        }

        //no match
        return true;
    }

    clear = () => {
        this.nums = Array.from(
            { length: this.SIZE },
            (r: number) =>
                Array.from(
                    { length: this.SIZE },
                    (c: number) => ({row: r, col: c, val: 0, mod: false})));
    }

    isFinished() {
        return this.nums.filter(v => v.filter(i => i.val === 0).length === 0).length === 9;
    }

    fill = () => {
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                if (this.nums[i][j].val === 0) {
                    for (let k = 1; k <= 9; k++) {
                        if (this.available(i, j, k)) {
                            this.nums[i][j].val = k;
                            if (this.fill()) return true;
                            this.nums[i][j].val = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private removeElements = (n: number)=> {
        let r = 0;
        let c = 0;

        while (n > 0) {
            [r, c] = [this.getRandomNumber(), this.getRandomNumber()];

            if (this.nums[r][c].val !== 0) {
                this.nums[r][c].val = 0;
                this.nums[r][c].mod = true;
                n--;
            }
        }
    }

    generate = (n : number) => {
        //clear data
        this.clear()

        //generate the first line then shuffle
        for (let i = 0; i < this.SIZE; i++) {
            this.nums[0][i].val = 9 - i;
        }
        shuffle(this.nums[0])

        //fill all blanks with legal number
        this.fill();

        //remove some numbers to make it a puzzle.
        this.removeElements(n);

        //return the answer for test.
        return this.nums;
    }

    toString = (s: Cell[][])=> {
        console.table(s.map(v => v.map(c => c.val)))
    }
}
