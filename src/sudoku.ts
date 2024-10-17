import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js'
import {Generator, to1D} from "./generator.ts";

@customElement('my-sudoku')
export class Sudoku extends LitElement {

    //public data
    @state() value = 0;
    @state() focused = 0;
    @state() infos = '';
    @state() gen = new Generator();

    //@property() nums : number[] = this.gen.generate();

    private toggleValue = (v: number) => {
        this.gen.setNumber(this.focused, v);
        this.requestUpdate()
    };

    private focusOn = (row: number, col: number) => {
        this.focused = to1D(row, col);
    }

    private highlightCheck = (v: number) => {
        if (this.focused === v) return true;
        return this.gen.getHighLight(this.focused, v);
    }

    private blockColorCheck = (v: number) => {
        let r = Math.floor(Math.floor(v / 9) / 3);
        let c = Math.floor((v % 9) / 3);
        return (r + c) % 2 === 1;
    }

    private startPage() {
        return html`<button @click="${this.gen.generate}">Start</button>`;
    }

    private sudoku() { //TODO: classMap or function for class?
        return html`
            ${map(
                range(9), (row) => html`
                    <div class="row">${map(
                        range(9), (col) => {
                            let v = to1D(row, col);
                            return html`
                                <button
                                    class="${classMap({
                                        black: !this.highlightCheck(v) && this.blockColorCheck(v),
                                        white: !this.highlightCheck(v) && !this.blockColorCheck(v),
                                        chosen: this.highlightCheck(v),
                                        leer: this.gen.isPositionEmpty(v),
                                        sudoku: true
                                    })}"
                                    @click="${() => this.focusOn(row, col)}"
                                >
                                    ${this.gen.getNumber(v)}
                                </button>
                            `;
                        })}
                    </div>
                `
            )}
        `;
    }

    private numPaddle() {
        return html`
            ${map(
                range(3), (row) => html`
                    <div class="row">${map(
                        range(3), (col) => {
                            let v = row * 3 + col + 1; 
                            return html`
                                <button
                                    class="numPdl"
                                    @click="${() => this.toggleValue(v)}"
                                    ?disabled="${this.gen.available(this.focused, v)}"
                                >
                                    ${v}
                                </button>
                            `;
                        })}
                    </div>
                `
            )}
        `;
    }

    //TODO: LIST:
    //1. add guess part
    //2. add highlight for same number, and the row-col(-block) indicator.
    render() {
        this.infos = this.gen.isFinished() ? 'Win!' : '';

        return html`<p class="title">Sudoku v1.0</p>
            <p>${this.startPage()}</p>
            <div>${this.sudoku()}</div>
            <p></p>
            <div class="left">${this.numPaddle()}</div>
            <div class="right">${this.numPaddle()}</div>
            
            <div>${this.infos}</div>
        `;
    }

    static styles = css`
        :host {
            display: block;
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
            height: 65px;
            width: 65px;
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
            background-color: #1bd1a5;
            opacity: 0.6;
        }

        .leer {
            color: transparent;
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
        
        .title {
            font-size: 1.5em;
        }
        
        .black {
            background-color: #065279;
        }
        
        .white {
            background-color: #003472;
        }
    `;
}


declare global {
    interface HTMLElementTagNameMap {
        'my-sudoku': Sudoku
    }
}