import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
//import {play, pause, replay} from '../assets/icons.ts';

@customElement("my-timer")
export class MyTimer extends LitElement {
    static styles = css`

    :host {
      display: inline-block;
      min-width: 4em;
      text-align: center;
      margin: 0.2em 0.1em;
    }
    footer {
      user-select: none;
      font-size: 0.6em;
    }
    `;

    @state() private time: number | null = null;
    @state() private running: boolean = false;
    @state() private remaining = 0;

    /*<footer>
        ${this.running ?
                html`<span @click=${this.stop}>${pause}</span>` :
                html`<span @click=${this.start}>${play}</span>`}
              <span @click=${this.reset}>${replay}</span>
            </footer>*/
    render() {
        const {remaining} = this;
        const min = Math.floor(remaining / 60000);
        const sec = pad(min, Math.floor(remaining / 1000 % 60));
        const hun = pad(true, Math.floor(remaining % 1000 / 10));
        return html`
            ${min ? `${min}:${sec}` : `${sec}.${hun}`}
        `;
    }

    start() {
        this.time = Date.now() - this.remaining;
        this.running = true;
        this.tick();
    }

    stop() {
        this.running = false;
    }

    reset() {
        this.remaining = 0;
    }

    tick() {
        if (this.running) {
            this.remaining = Math.max(0, Date.now() - this.time!);
            requestAnimationFrame(() => this.tick());
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('timer-message', this.remoteControl);
        this.reset();
    }

    disconnectedCallback() {
        this.removeEventListener('timer-message', this.remoteControl);
        super.disconnectedCallback();
    }

    remoteControl(ev : Event) {
        const running = !(ev.target as HTMLBodyElement).hidden;
        if (running) {
            this.start();
        } else {
            this.stop();
        }
    }
}

function pad(pad: unknown, val: number) {
    return pad ? String(val).padStart(2, '0') : val;
}