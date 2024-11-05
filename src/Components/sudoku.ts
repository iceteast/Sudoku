import {LitElement, css, html, PropertyValues} from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js'
import {Generator} from "./generator.ts";

interface Score {
    name: string;
    score: number;
}

@customElement('my-sudoku')
export class Sudoku extends LitElement {
    static styles = css`
        /* global setting */

        :host {
            width: 95%;
            display: block;
            margin: 0 auto;
            text-align: center;
        }

        /* number paddle */

        .numPdl {
            aspect-ratio: 1;
            width: 2vw;
            min-width: 30px;
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

        /* game paddle */

        .sudoku {
            aspect-ratio: 1;
            width: 8vw;
            min-width: 55px;
            max-width: 85px;
            color: #dddddd;
            font-size: 2.2vw;
            min-font-size: 117px;
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

        /* focused blank */

        .chosen {
            background-color: #a98601;
        }

        .firm {
            color: #939393;
        }

        /* empty blank */

        .leer {
            color: transparent;
        }

        /* padding between row and rows in sudoku */

        .row {
            padding-bottom: 0.35rem;
        }

        /* two columns style */

        .left {
            float: left;
            width: 20%;
        }

        .right {
            float: right;
            width: 20%;
        }

        /* title font */

        .container {
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .title {
            font-size: 3rem;
            width: 100%;
            text-align: center;
        }

        .pCentered {

            width: 100%;
            text-align: center;
            position: absolute;
            left: 0;
            right: 0;
            z-index: 1;
        }

        .right-aligned {
            margin-left: auto;
            text-align: right;
            z-index: 2;
        }

        /* two colors checkerboard */

        .black {
            background-color: #032639;
        }

        .white {
            background-color: #001432;
        }

        /* a fancy leaderboard */

        .fancy-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            //font-size: 18px;
            text-align: center;
            background: linear-gradient(90deg, #ff9a9e, #fad0c4, #fad0c4, #fbc2eb, #a18cd1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .fancy-table th, .fancy-table td {
            border: 1px solid #dddddd;
        }

        .fancy-table th {
            background-color: #4CAF50;
        }

        .fancy-table tbody tr:hover {
            background-color: #088a5b;
        }
    `;

    //public data

    @state() infos = 'Welcome!';            //message in startpage
    @state() gen = new Generator();     //random generator
    @state() gameover = true;             //gameover flag
    @property({type: Number}) option = 20;   //puzzle amount in Sudoku
    @state() leaderboard: Array<Score> = Array(5).fill({name: 'Empty', score: 0});

    // private isValidUsername = (username : string) => /^[a-zA-Z0-9_]{1,13}$/.test(username);

    // private toggleLB = (username: string, score: number) => {
    //    if (this.isValidUsername(username) || score > this.leaderboard[4].score) {
    //        let flag = false;
    //        const tmp = ({name: '', score: 0});
    //        for (const s of this.leaderboard) {
    //            if (flag) {
    //                [s.name, tmp.name] = [tmp.name, s.name];
    //                [s.score, tmp.score] = [tmp.score, s.score];
    //            }
    //
    //            if (s.score < score && !flag) {
    //                tmp.name = s.name;
    //                tmp.score = s.score;
    //                s.name = username;
    //                s.score = score;
    //                flag = true;
    //            }
    //        }
    //    }
    // }

    /**
      * set number in focused blank and check win.
      * @param {number} v - number need to be inputted.
      **/
    private toggleValue = (v: number) => {

        this.gen.setNumber(v);
        this.checkWin();
        this.requestUpdate()
    };

    private setFocus = (r: number, c: number) => {
        this.gen.setFocus(r, c);
        this.requestUpdate();
    }

    /**
     * check if this blank need to be highlighted.
     * @param {number} r - row of the blank
     * @param {number} c - column of the blank
     **/
    private highlightCheck =
        (r: number, c: number) => this.gen.isHighLight(r, c);

    /**
     * render the color of checkerboard.
     * @param {number} r - row of the blank
     * @param {number} c - column of the blank
     **/
    private blockColorCheck =
        (r: number, c: number) => (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 1;

    /**
     * check if gameover.
     **/
    private checkWin = () => {
        this.gameover = this.gen.isFinished();
        this.infos = this.gameover ? 'Win! Start Again?' : 'Welcome!';
    }

    /**
     * generate a game and start.
     **/
    private startGame() {
        this.gameover = false;
        this.gen.generate(this.option);
        this.sendMessage();
        this.requestUpdate();
    }

    /**
     * modify the game difficult.
     * @param {Event} e - the select list change event.
     **/
    private changeDifficult(e: Event) {
        const v = (e.target as HTMLInputElement).value;
        this.option = Number.parseInt(v);
    }

    /**
     * render game pad.
     **/
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
                                        leer:   this.gen.isPositionEmpty(row, col),
                                        firm:   this.gen.isPositionFirm(row, col),
                                        sudoku: true
                                    })}"
                                    @click="${() => this.setFocus(row, col)}"
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

    /**
     * render number pad for number input.
     **/
    private numPaddle() {
        return html`
            <p class="fancy-table">Input Pad</p>
            ${map(
                range(3), (row) => html`
                    <div class="row">${map(
                        range(3), (col) => {
                            let v = row * 3 + col + 1; 
                            return html`
                                <button
                                    class="numPdl"
                                    @click="${() => this.toggleValue(v)}"
                                    ?disabled="${!this.gen.availableFocus(v)}"
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


    /**
     * render leaderboard div.
     **/
    private leaderBoard = () => {
        return html`
            <div>
                <table class="fancy-table">
                    <tr>
                        <td><b>Name</b></td>
                        <td><b>Score</b></td>
                    </tr>
                    ${map(
                        range(5), (col) => {
                            return html`
                                <tr>
                                    <td>${this.leaderboard[col].name!}</td>
                                    <td>${this.leaderboard[col].score!}</td>
                                </tr>
                            `;
                        }
                    )}
                    <tr>
                        <td>${this.gen.chosen[0]}</td>
                        <td>${this.gen.chosen[1]}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    /**
     * render start page.
     **/
    private startPage = () => {
        return html`
            <div class="title">Sudoku v1.0</div>
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

    /**
     * render game page.
     **/
    private mainPage = () => {
        return html`
            <div class="container">
                <div class="pCentered">${this.sudoku()}</div>
                <div class="right-aligned">
                    <p class="fancy-table"><my-timer></my-timer></p>
                    ${this.numPaddle()}
                    ${this.leaderBoard()}
                </div>
            </div>
        `;
    }

    /**
     * harmless function.
     **/
    private dashboard =
        () => this.gameover ? this.startPage() : this.mainPage();

    /**
     * send the start signal. For example a timer.
     */
    sendMessage() {
        let ev = new CustomEvent('timer-message', {
            detail: {
                running : !this.gameover,
                bubbles: true,
                composed: true,
            }
        });

        this.dispatchEvent(ev)
    }

    connectedCallback() {
        super.connectedCallback();
        const savedData = localStorage.getItem('leaderboard');
        this.leaderboard = savedData ? JSON.parse(savedData) : Array(5).fill({name: 'Empty', score: 0});
    }

    updated(changedProperties : PropertyValues<this>) {
        if (changedProperties.has('leaderboard')) {
            localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
        }
    }

    //TODO: LIST:
    //1. add guess part
    //2. add a time counter and records.
    //3. add digital numbers with svg.
    render() {
        return html`
            ${this.dashboard()}
        `;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'my-sudoku': Sudoku
    }
}