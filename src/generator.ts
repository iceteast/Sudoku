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


export const to1D = (row : number, col : number) => row * 9 + col;

export class Generator {

    SIZE = 81;
    nums: number[] = Array(this.SIZE).fill(0);

    //math functions
    getBlock(loc: number) {
        //calc the row and col of blocks(3*3)
        let r = Math.floor(Math.floor(loc / 9) / 3);
        let c = Math.floor((loc % 9) / 3);

        //calc the left-top number of block
        let k = r * 27 + c * 3
        return [k, k + 1, k + 2, k + 9, k + 10, k + 11, k + 18, k + 19, k + 20];
    }

    getRow(loc: number) {
        let c = loc;
        //find the first element of this row.
        while (c % 9 != 0) { c--; }
        return [c, c + 1, c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8];
    }

    getCol(loc: number) {
        let c = loc;
        //find the first element of this column.
        while (c / 9 >= 1) { c -= 9; }
        return [c, c + 9, c + 18, c + 27, c + 36, c + 45, c + 54, c + 63, c + 72];
    }

    getHighLight(loc: number, v: number) {
        return !!(this.nums[v] && this.nums[v] === this.nums[loc]);
    }

    isPositionEmpty(loc: number): boolean {
        return this.nums[loc] === 0;
    }

    setNumber(loc: number, v: number) {
        if (this.nums[loc] === v) {this.nums[loc] = 0;}
        if (this.nums[loc] === 0) {this.nums[loc] = v;}
    }

    getNumber(loc: number) {
        return this.nums[loc];
    }

    getRandomNumber = () => Math.floor(getRand() * 9) + 1;

    available(focused: number, v: number) {
        //allow to cancel the number
        if (this.nums[focused] === v) return false;

        //same number in block
        let block = this.getBlock(focused)
            .map(n => this.nums[n]);
        for (let i of block) {
            if (v === i) return true;
        }

        //same number in row
        let row = this.getRow(focused)
            .map(n => this.nums[n]);
        for (let i of row) {
            if (v === i) return true;
        }

        //same number in column
        let col = this.getCol(focused)
            .map(n => this.nums[n]);
        for (let a of col) {
            if (v === a) return true;
        }

        //no match
        return false;
    }

    isFinished() {
        return this.nums.filter(v => v === 0).length === 0;
    }

    private fill = () => {
        for (let i = 0; i < this.SIZE; i++) {
            if (!this.nums[i]) {
                for (let j = 1; j <= 9; j++) {
                    if (this.available(i, j)) {
                        this.nums[i] = j;
                        if (this.fill()) return true;
                        this.nums[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    private removeElements = (n: number)=> {
        let c = n;
        while (c >= 0) {
            let k = Math.floor(getRand() * 81);
            if (this.nums[k] !== 0) {
                this.nums[k] = 0;
                c--;
            }
        }
    }

    generate = () => {
        this.fill();
        this.removeElements(3);
        return this.nums;
    }
}
