import { decomposeTextToLine } from '../util/text';

export type GameInput = {
  kT: number;
  // loggedInPlayerNum: number[];
  loggedInPlayers: number[][];
};

export function parseGameInputParser(text: string): GameInput | Error {
  const gin = decomposeTextToLine(text);

  const line1 = gin.next();
  if (line1.done) return new Error('line 1: too short input');
  if (line1.value instanceof Error) return line1.value;
  if (line1.value.values.length < 2) return new Error('line 1: need 2 numbers');

  const kT = line1.value.values[0];
  const kR = line1.value.values[1];
  if (kT < 6) return new Error(`line 1: too small T; T = ${kT}`);
  if (kT > 10000)
    // 3600
    return new Error(`line 1: too large T; T = ${kT}`);
  if (kR !== 4) return new Error(`line 1: R != 4 is not supported; R = ${kR}`);

  const loggedInPlayers = [];
  for (const lineRaw of gin) {
    if (lineRaw instanceof Error) return lineRaw;
    const { lineno, values } = lineRaw;

    if (kT <= loggedInPlayers.length)
      return new Error(`line ${lineno}: too many lines`);
    if (values.length === 0)
      return new Error('internal error: values.length === 0');

    const n = values.shift();
    if (values.length !== n)
      return new Error(
        `line ${lineno}: invalid N; length = ${values.length}, N = ${n}`
      );
    for (const v of values) {
      if (v < 0 || 100 < v)
        return new Error(`line ${lineno}: invalid S; S = ${v}`);
    }

    loggedInPlayers.push(values);
  }

  if (loggedInPlayers.length !== kT) {
    return new Error('line 1: too few lines');
  }

  // const loggedInPlayerNum = loggedInPlayers
  //   .map((a) => a.length)
  //   .reduce(
  //     (s, e) => {
  //       s.push(s[s.length - 1] + e);
  //       return s;
  //     },
  //     [0]
  //   );

  return { kT, loggedInPlayers };
}
