const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
const SIMILAR_CHARS = new Set(['O', '0', 'l', '1', 'I']);
const AMBIGUOUS_CHARS = new Set(['{', '}', '[', ']', '(', ')', '/', '\\', '\'', '"', '`', ',', ';', ':', '.', '<', '>']);

function getRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffle(value) {
  const chars = value.split('');
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function sanitizePool(pool, avoidSimilar, avoidAmbiguous) {
  return pool
    .split('')
    .filter((char) => !(avoidSimilar && SIMILAR_CHARS.has(char)))
    .filter((char) => !(avoidAmbiguous && AMBIGUOUS_CHARS.has(char)))
    .join('');
}

export function generatePassword(options) {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    avoidSimilar,
    avoidAmbiguous
  } = options;

  const groups = [];
  if (includeUppercase) groups.push(sanitizePool(UPPERCASE, avoidSimilar, avoidAmbiguous));
  if (includeLowercase) groups.push(sanitizePool(LOWERCASE, avoidSimilar, avoidAmbiguous));
  if (includeNumbers) groups.push(sanitizePool(NUMBERS, avoidSimilar, avoidAmbiguous));
  if (includeSymbols) groups.push(sanitizePool(SYMBOLS, avoidSimilar, avoidAmbiguous));

  const validGroups = groups.filter(Boolean);
  if (validGroups.length === 0) return '';

  const allChars = validGroups.join('');
  if (!allChars) return '';

  const output = [];

  // Guarantee at least one character from each enabled group.
  validGroups.forEach((group) => {
    output.push(group[getRandomInt(group.length)]);
  });

  while (output.length < length) {
    output.push(allChars[getRandomInt(allChars.length)]);
  }

  return shuffle(output.join('').slice(0, length));
}

export function generateMultiplePasswords(options, count = 5) {
  const entries = [];
  for (let i = 0; i < count; i += 1) {
    entries.push(generatePassword(options));
  }
  return entries.filter(Boolean);
}
