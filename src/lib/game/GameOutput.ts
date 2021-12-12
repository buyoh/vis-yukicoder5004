import { decomposeTextToLine } from '../util/text';
import { GameInput } from './GameInput';

export type TickAction = {
  unite: [number, number][]; // 0-indexed
};

export type GameOutput = {
  actions: TickAction[];
};

export function parseGameOutputParser(
  text: string,
  gameInput: GameInput
): GameOutput | Error {
  const gin = decomposeTextToLine(text);

  const gameOutput = { actions: [] } as GameOutput;

  let tick = 0;
  let playerNum = 0;

  for (const lineRaw of gin) {
    if (lineRaw instanceof Error) return lineRaw;
    const { lineno, values } = lineRaw;

    if (gameOutput.actions.length >= gameInput.kT) {
      return new Error(`line ${lineno}: too many lines: T = ${gameInput.kT}`);
    }

    if (values.length !== 1) {
      return new Error(`line ${lineno}: expected 1 number (M)`);
    }
    const m = values[0];
    if (m < 0 || 10000 < m) {
      return new Error(`line ${lineno}: invalid M; M = ${m}`);
    }

    playerNum += gameInput.loggedInPlayers[tick].length;

    const tickAction = { unite: [] } as TickAction;
    for (;;) {
      if (tickAction.unite.length >= m) {
        break;
      }

      // for of 構文を使うと break 時に gin.return が呼ばれて 0 になってしまうため
      // 手動でループする
      const next = gin.next();
      if (next.done) break;
      const lineRaw = next.value;

      if (lineRaw instanceof Error) return lineRaw;
      const { lineno, values } = lineRaw;

      if (values.length !== 2) {
        return new Error(`line ${lineno}: expected 2 numbers (u, v)`);
      }
      const [u, v] = values;
      if (u <= 0 || playerNum < u || v <= 0 || playerNum < v) {
        return new Error(`line ${lineno}: invalid u, v; u = ${u}, v = ${v}`);
      }

      tickAction.unite.push([u - 1, v - 1]);
    }

    if (tickAction.unite.length !== m) {
      return new Error(`line ${lineno}: too few lines: M = ${m}`);
    }

    gameOutput.actions.push(tickAction);
    tick += 1;
  }

  if (gameOutput.actions.length !== gameInput.kT) {
    return new Error(
      `line xxx: too few lines: T = ${gameInput.kT} q = ${gameOutput.actions.length}`
    );
  }

  return gameOutput;
}
