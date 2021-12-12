import { GameInput } from './GameInput';
import { GameOutput } from './GameOutput';
import { GameState } from './GameState';

const kSkip = 30;

export class GameStateStore {
  private input: GameInput;
  private output: GameOutput;
  private store: GameState[];
  constructor(input: GameInput, output: GameOutput) {
    this.input = input;
    this.output = output;
    this.store = [];
  }

  constT(): number {
    return this.input.kT;
  }

  build(): null | Error {
    this.store = [];
    const state = new GameState();
    for (let tick = 0; tick < this.input.kT; ++tick) {
      if (tick % kSkip === 0) this.store.push(state.clone());
      const err = state.apply(this.input, this.output.actions[tick]);
      if (err) {
        this.store = [];
        return err;
      }
    }
    if (this.input.kT % kSkip === 0) this.store.push(state.clone());
    return null;
  }

  get(tick: number): GameState {
    if (tick < 0) throw RangeError();
    if (tick > this.input.kT) throw RangeError();
    const idx = Math.floor(tick / kSkip);
    const state = this.store[idx].clone();
    for (let t = idx * kSkip; t < tick; ++t) {
      state.apply(this.input, this.output.actions[t]);
    }
    return state;
  }
}
