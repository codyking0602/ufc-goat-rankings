# UFC GOAT App Compare Mode

This file is the source map for Compare Mode. Use it when continuing the app in a new chat.

## Current goal

Compare Mode should feel like a polished debate card, not a spreadsheet.

The output should usually show:

1. Two clean fighter cards.
2. A headline verdict.
3. The losing fighter's best argument.
4. Why the winner still wins.
5. A short final take.

The main Compare output should stay natural and group-chat friendly. Category numbers can support the engine, but they should not become the main visual experience unless a drill-down is needed.

## Canonical Compare source

All fighter-specific Compare data now belongs in:

`assets/data/ranking-data.js`

Each fighter object may include:

```js
compare: {
  shortCase: '',
  peak: '',
  resume: '',
  championship: '',
  opponentQuality: '',
  longevity: '',
  counter: '',
  edge: '',
  signatureWins: '',
  weakness: '',
  titleSummary: '',
  primeSummary: '',
  titleStyle: '',
  primeStyle: '',
  legacyStats: {}
}
