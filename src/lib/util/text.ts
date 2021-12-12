export function* decomposeTextToLine(text: String) {
  const lines = text.split(/[\r\n]/);
  let lineno = 0;
  for (const line of lines) {
    lineno += 1;
    if (line.length === 0) continue;
    const li = line.split(/\s/).map((e) => parseInt(e));
    if (li.some((e) => isNaN(e))) {
      yield new Error(`line ${lineno}: invalid values are contained`);
      break;
    }
    yield { lineno, values: li };
  }
}
