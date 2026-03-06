import { WORD_LIST } from '../data/wordlist.js';

function getRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function maybeCapitalize(word, enabled) {
  if (!enabled || !word) return word;
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

export function generatePassphrase({ words = 4, separator = '-', capitalize = false, numberSuffix = false }) {
  const selected = [];

  for (let i = 0; i < words; i += 1) {
    const word = WORD_LIST[getRandomInt(WORD_LIST.length)];
    selected.push(maybeCapitalize(word, capitalize));
  }

  let phrase = selected.join(separator);
  if (numberSuffix) {
    phrase += `${Math.floor(getRandomInt(1000)).toString().padStart(3, '0')}`;
  }

  return phrase;
}
