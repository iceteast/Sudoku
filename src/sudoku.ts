import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js'

@customElement('my-sudoku')
export class Sudoku extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 980px;
            height: 430px;
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }

        .numPdl {
            height: 40px;
            width: 40px;
            border-radius: 3px;
            border: 1px solid transparent;
            padding: 0.6em 1.1em;
            justify-content: center;
            background-color: #1a1a1a;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        .numPdl:hover {
            background-color: #696;
        }

        .sudoku {
            height: 80px;
            width: 80px;
            font-size: 45px;
            border-radius: 13px;
            border: 1px solid antiquewhite;
            justify-content: center;
            background-color: #1a1a1a;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        .sudoku:hover {
            background-color: #4b397c;
        }

        .sudoku:focus,
        .sudoku:focus-visible {
            outline: 2px auto -webkit-focus-ring-color;
        }
        
        .chosen {
            height: 80px;
            width: 80px;
            border-radius: 13px;
            border: 1px solid antiquewhite;
            justify-content: center;
            cursor: pointer;
            transition: border-color 0.25s;
            background-color: #11397c;
            opacity: 0.6;
        }

        .leer {
            height: 80px;
            width: 80px;
            border-radius: 13px;
            border: 1px solid antiquewhite;
            justify-content: center;
            cursor: pointer;
            transition: border-color 0.25s;
            background-color: #1a1a1a;
            color: #1a1a1a;
        }

        .leer:hover {
            color: #4b397c;
        }
        .row {
            padding-bottom: 0.35em;
        }
        
        .left {
            float: left;
            width: 50%;
        }
        
        .right {
            float: right;
            width: 50%;
        }
    `;

    //public data
    @property() nums : number[] = [
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
        0, 0, 0, 0 ,0, 0, 0 ,0, 0,
    ];

    @state() value = 0;
    @state() focused = 0;
    @state() infos = '';

    //math functions
    private to1D = (row : number, col : number) => row * 9 + col;

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

    private checkSeries : number[][] = [[0, 1, 2],
                                        [3, 4, 5],
                                        [6, 7, 8],
                                        [0, 3, 6],
                                        [1, 4, 7],
                                        [2, 5, 8],
                                        [0, 4, 8],
                                        [2, 4, 6]]; //TODO:

    private hasNums(v: number) { //TODO
        //same number in block
        let block = this.getBlock(this.focused)
            .map(n => this.nums[n]);
        for (let i of block) {
            if (v == i) return true;
        }

        //same number in row
        let row = this.getRow(this.focused)
            .map(n => this.nums[n]);
        for (let i of row) {
            if (v == i) return true;
        }

        //same number in column
        let col = this.getCol(this.focused)
            .map(n => this.nums[n]);
        for (let a of col) {
            if (v == a) return true;
        }

        //no match
        return false;
    }

    private toggleValue = (v: number) => {
        this.nums[this.focused] = this.nums[this.focused] == v ? 0 : v
        this.requestUpdate()
    };

    private focusOn = (row: number, col: number) => {
        this.focused = this.to1D(row, col);
    }



    private checkWin() { //TODO
        for (let l of this.checkSeries) {
            if (!(l[0] != l[1] && l[1] != l[2] && l[0] != l[2])) return false;
        }
        return true;
    }

    private sudoku() {
        return html`
            ${map(
                    range(9), (row) => html`
                        <div class="row">${map(
                                range(9), (col) => html`
                                    <button
                                            class="${classMap({
                                                chosen: (this.focused == this.to1D(row, col)),
                                                leer: this.nums[this.to1D(row, col)] == 0,
                                                sudoku: true
                                            })}"
                                            @click="${() => this.focusOn(row, col)}"
                                    >
                                        ${this.nums[this.to1D(row, col)]}
                                    </button>
                                `
                        )}
                        </div>
                    `
            )}`;
    }

    private numPaddle() {

        return html`
            ${map(
                    range(3), (row) => html`
                        <div class="row">${map(
                                range(3), (col) => html`
                                    <button
                                            class="numPdl"
                                            @click="${() => this.toggleValue(this.to1D(row, col) + 1)}"
                                            ?disabled="${this.hasNums(this.to1D(row, col) + 1)}"
                                    >
                                        ${row * 3 + col + 1}
                                    </button>
                                `
                        )}
                        </div>
                    `
            )}`;
    }

    render() {
        if (this.checkWin()) this.infos = 'Win!'; else this.infos = '';

        return html`<p>Sudoku v1.0</p>
            <div>${this.sudoku()}</div>
            <p></p>
            <div class="left">${this.numPaddle()}</div>
            <div class="right">${this.numPaddle()}</div>
            
            <div>${this.infos}</div>
        <p>${this.focused} + ${this.value}</p>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'my-sudoku': Sudoku
    }
}