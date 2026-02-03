/* eslint-disable no-console */
import { formatMoneyFa, numberToWordsFa, parseLooseNumber } from '../dist/index.js';

const input = '۱۲٬۳۴۵٫۶۷';
const parsed = parseLooseNumber(input);

console.log({
  input,
  parsed,
  words: numberToWordsFa(parsed ?? 0),
  money: formatMoneyFa(parsed ?? 0),
});
