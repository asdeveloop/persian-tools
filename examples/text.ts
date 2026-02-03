import { cleanPersianText, normalizePersianChars, stripPersianDiacritics } from '../dist/index.js';

console.log(normalizePersianChars('كباب و يار'));
console.log(stripPersianDiacritics('سَلام'));
console.log(cleanPersianText('  كتابها  '));
