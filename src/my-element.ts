import { LitElement, css, html } from 'lit'
import { customElement, property, state} from 'lit/decorators.js'
import {map} from 'lit/directives/map.js'
import {range} from 'lit/directives/range.js'
import bomb from "./assets/bomb.svg"

type Cell = {row : number, col: number, mine : boolean, num : number};
const LENGTH = 10;

@customElement('my-element')
export class MyElement extends LitElement {

  @state()
  length = 10;
  @state()
  flag = false

  @property()
  data : Array<Array<Cell>> = [];
  @property()
  game = true;
  @property()
  gameState = "Start"

  render() {
    return html`
        <p>Minesweeper /w lit : ${this.gameState}</p>
        ${this.game ? this.welcome : this.chessboard}
      `;

  }
  welcome = html`<button @click="${this._init}">Start</button>`;
  chessboard = html`
    <div class="chessboard">
      ${map(
          range(LENGTH),
          (row) =>
              map(
                  range(LENGTH),
                  (col) => html`
                    <button 
                        class="${this._getClass(row, col)}"
                        @click="${() => this._check(row, col)}">
                      ${this._getSymbol(row, col)}
                    </button>`
              )
      )}
    </div>`; //TODO : () => need to be changed.

  private _init() {

    if (!this.data) this.data = [];

    for (let i = 0; i < LENGTH; i++) {
      const arr:Array<Cell> = [];
      for (let j = 0; j < LENGTH; j++) {
        arr.push({
          row : i,
          col : j,
          mine : false,
          num : 0,
        })
      }
      this.data.push(arr);
    }
    this._generateMines(3, 3)
    this.game = false;
    this.flag = false;
    this.gameState = "Playing";
  }

  private _check(row: number, col: number) {
    //if (!this.flag) this._generateMines(row, col);
    if (this.data[row][col].mine) {
      this.game = true;
      this.gameState = "Lose";
    }
  }

  private _generateMines(row: number, col: number) {
    for (let i = 0; i < LENGTH; i++) {
      for (let j = 0; j < LENGTH; j++) {
        this.data[i][j].mine = (
            Math.abs(row - i) < 2 && Math.abs(col - j) < 2)
              ? false
              : Math.random() < 0.23;
      }
    }
    this.flag = true;
  }

  private _getClass(row: number, col: number) {
    return (row + col) % 2 == 0 ? 'white' : 'black';
  }
  private _getSymbol(row: number, col: number) {
    return this.data[row][col].mine ? bomb : ' ';
  }
  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    :host {
      display: block;
      width: 480px;
      height: 430px;
    }
    #board {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: repeat(10, 1fr);
      border: 2px solid #404040;
      box-sizing: border-box;
      height: 100%;
    }
    #board > div {
      padding: 2px;
    }
    .black {
      color: #ddd;
      background: black;
    }
    .white {
      color: gray;
      background: white;
    }
    
    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }

    a:hover {
      color: #535bf2;
    }
    
    chessboard {
      justify-content: center;
    }
    
    button {
      height: 40px;
      width: 40px;
      border-radius: 3px;
      border: 1px solid transparent;
      //padding: 0.6em 1.2em;
      //justify-content: center;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    button:hover {
      border-color: #646cff;
    }

    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #2025db;
      }

      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
