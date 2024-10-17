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

export function shuffle(arr : number[]) {
    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(getRand() * arr.length);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export class Generator {

    SIZE = 9;
    nums: number[][] = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));

    isHighLight(focusedR: number, focusedC: number, checkR: number, checkC: number) {
        if (focusedR === checkR && focusedC === checkC) return true;
        return !!(this.nums[focusedR][focusedC] && this.nums[focusedR][focusedC] === this.nums[checkR][checkC]);
    }

    isPositionEmpty(r: number, c: number): boolean {
        return this.nums[r][c] === 0;
    }

    setNumber(r: number, c: number, v: number) {
        if (this.nums[r][c] === v) {this.nums[r][c] = 0;}
        if (this.nums[r][c] === 0) {this.nums[r][c] = v;}
    }

    getNumber(r: number, c: number) {
        return this.nums[r][c];
    }

    getRandomNumber = () => Math.floor(getRand() * 9);

    available(r: number, c: number, v: number) {
        //allow to cancel the number
        if (this.nums[r][c] === v) return true;

        //same number in block

        //calc the left-top coordinate of block
        let x = Math.floor(r / 3) * 3;
        let y = Math.floor(c / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.nums[x + i][y + j] === v) return false;
            }
        }

        //same number in row & col
        for (let i = 0; i < this.SIZE; i++) {
            if (this.nums[r][i] === v || this.nums[i][c] === v) {
                return false;
            }
        }

        //no match
        return true;
    }

    clear = () => {
        this.nums = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));
    }

    isFinished() { //TODO : need to check
        return this.nums.filter(v => v.filter(i => i === 0).length === 0).length === 9;
    }

    private fill = () => {
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                if (this.nums[i][j] === 0) {
                    for (let k = 1; k <= 9; k++) {
                        if (this.available(i, j, k)) {
                            this.nums[i][j] = k;
                            if (this.fill()) return true;
                            this.nums[i][j] = 0;
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

            if (this.nums[r][c] !== 0) {
                this.nums[r][c] = 0;
                n--;
            }
        }
    }

    generate = (n : number) => {
        //clear data
        this.clear()

        //generate the first line then shuffle
        for (let i = 0; i < this.SIZE; i++) {
            this.nums[0][i] = 9 - i;
        }
        shuffle(this.nums[0])

        //fill all blanks with legal number
        this.fill();

        //remove some numbers to make it a puzzle.
        this.removeElements(n);

        //return the answer for test.
        return this.nums;
    }
}
