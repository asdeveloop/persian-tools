/* eslint-disable no-console */
import { formatPersianDate, toPersianNumbers } from '../dist/index.mjs';

const now = new Date();
console.log(toPersianNumbers('Invoice 2024'));
console.log(formatPersianDate(now));
