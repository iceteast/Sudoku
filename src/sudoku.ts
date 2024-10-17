import { LitElement, css, html } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js'
import {Generator} from "./generator.ts";

@customElement('my-sudoku')
export class Sudoku extends LitElement {

    //public data
    @state() value = 0;
    @state() focused = [0, 0];
    @state() infos = 'Welcome!';
    @state() gen = new Generator();
    @state() gameover = true;
    @property({type: Number}) option = 20

    private toggleValue = (v: number) => {
        this.gen.setNumber(this.focused[0], this.focused[1], v);
        this.checkWin();
        this.requestUpdate()
    };

    private focusOn = (row: number, col: number) => {
        this.focused = [row, col];
    }

    private highlightCheck =
        (r: number, c: number) => this.gen.isHighLight(this.focused[0], this.focused[1], r, c);


    private blockColorCheck =
        (r: number, c: number) => (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 1;

    private checkWin = () => {
        this.gameover = this.gen.isFinished();
        this.infos = this.gameover ? 'Win! Start Again?' : 'Welcome!';
    }

    private startGame() {
        this.gameover = false;
        this.gen.generate(this.option);
        this.requestUpdate();
    }

    private changeDifficult(e: Event) {
        const v = (e.target as HTMLInputElement).value;
        this.option = Number.parseInt(v);
    }
    private sudoku() { //TODO: classMap or function for class?
        return html`
            ${map(
                range(9), (row) => html`
                    <div class="row">${map(
                        range(9), (col) => {
                            return html`
                                <button
                                    class="${classMap({
                                        black: !this.highlightCheck(row, col) && this.blockColorCheck(row, col),
                                        white: !this.highlightCheck(row, col) && !this.blockColorCheck(row, col),
                                        chosen: this.highlightCheck(row, col),
                                        leer: this.gen.isPositionEmpty(row, col),
                                        sudoku: true
                                    })}"
                                    @click="${() => this.focusOn(row, col)}"
                                >
                                    ${this.gen.getNumber(row, col)}
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
            <p>Input Pad</p>
            ${map(
                range(3), (row) => html`
                    <div class="row">${map(
                        range(3), (col) => {
                            let v = row * 3 + col + 1; 
                            return html`
                                <button
                                    class="numPdl"
                                    @click="${() => this.toggleValue(v)}"
                                    ?disabled="${!this.gen.available(this.focused[0], this.focused[1], v)}"
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

    private startPage = () => {
        return html`
            <div>${this.infos}</div>
            <div>
                <button @click="${this.startGame}">Start</button>
                <select @change="${this.changeDifficult}">
                    <option value="20" selected > Easy   </option>
                    <option value="35"          > Middle </option>
                    <option value="55"          > Hard   </option>
                </select>
            </div>
        `;
    }

    private mainPage = () => {
        return html`
            <div class="left">${this.sudoku()}</div>
            <div class="right">${this.numPaddle()}</div>
            <div class="right">${this.numPaddle()}</div>
        `;
    }

    private dashboard =
        () => this.gameover ? this.startPage() : this.mainPage();

    //TODO: LIST:
    //1. add guess part
    //2. add a time counter and records.
    render() {


        return html`<p class="title">Sudoku v1.0</p><my-timer duration="130"></my-timer>
            ${this.dashboard()}
        `;
    }

    static styles = css`
        :host {
            width: 95%;
            display: block;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }

        .numPdl {
            height: 4vh;
            width:  2vw;
            border-radius: 0.3vw;
            border: 1px solid transparent;
            justify-content: center;
            background-color: #1a1a1a;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        .numPdl:hover {
            background-color: #696;
        }

        .sudoku {
            height: 6vh;
            width: 3vw;
            color: #dddddd;
            font-size: 2.2vw;
            border-radius: 0.5vw;
            border: 1px solid antiquewhite;
            justify-content: center;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        .sudoku:hover {
            background-color: #d9b611;
            opacity: 0.74;
        }

        .sudoku:focus,
        .sudoku:focus-visible {
            outline: 2px auto -webkit-focus-ring-color;
        }
        
        .chosen {
            background-color: #a98601;
            
        }

        .leer {
            color: transparent;
        }
        
        .row {
            padding-bottom: 0.35rem;
        }
        
        .left {
            float: left;
            width: 90%;
        }
        
        .right {
            float: right;
            width: 10%;
        }
        
        .title {
            font-size: 1.5rem;
        }
        
        .black {
            background-color: #032639;
        }
        
        .white {
            background-color: #001432;
        }
    `;
}


declare global {
    interface HTMLElementTagNameMap {
        'my-sudoku': Sudoku
    }
}