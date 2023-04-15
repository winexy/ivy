/**
 * @describe AST Transformer
 */
class Transformer {
  transformSwitchToIf(exp) {
    const [, ...cases] = exp;

    const ifExp = ['if', null, null, null];

    let current = ifExp;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCond, currentBlock] = cases[i];

      current[1] = currentCond;
      current[2] = currentBlock;

      const next = cases[i + 1];

      const [nextCond, nextBlock] = next;

      current[3] = nextCond === 'else' ? nextBlock : ['if'];

      current = current[3];
    }

    return ifExp;
  }
}

export { Transformer };
