import { GameInput, parseGameInputParser } from './GameInput';
import { GameOutput, parseGameOutputParser } from './GameOutput';
import { calcRoomScore } from './GameState';
import { GameStateStore } from './GameStateStore';

import * as Case00_ from './case00.json';
const Case00 = Case00_ as any;
import * as Case01_ from './case01.json';
const Case01 = Case01_ as any;

function createGameStateStore(
  inputText: string,
  outputText: string
): [GameInput, GameOutput, GameStateStore] {
  const input = parseGameInputParser(inputText);
  expect(input).not.toBeInstanceOf(Error);
  if (input instanceof Error) throw input;
  const output = parseGameOutputParser(outputText, input);
  expect(output).not.toBeInstanceOf(Error);
  if (output instanceof Error) throw output;
  const gss = new GameStateStore(input, output);
  gss.build();
  return [input, output, gss];
}

for (const kase of [
  ['case00', Case00],
  ['case01', Case01],
]) {
  const [casename, casejson] = kase;
  test(`validate score: ${casename}`, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [input, _output, gss] = createGameStateStore(casejson.i, casejson.o);
    {
      const s = gss.get(input.kT);
      const score = s
        .getRooms()
        .map((r) => calcRoomScore(r))
        .reduce((p, e) => p + e, 0);
      expect(score).toEqual(casejson.s);
    }
  });
}
