// Estimate entropy using a simple character-set model.
export function detectCharacterSet(password) {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^A-Za-z0-9]/.test(password)) size += 33;
  return size || 1;
}

export function estimateEntropy(password) {
  if (!password) return 0;
  const charsetSize = detectCharacterSet(password);
  return Math.log2(charsetSize ** password.length);
}

export function entropyToCrackTime(entropy) {
  if (entropy < 28) return 'Instant';
  if (entropy < 36) return 'Minutes';
  if (entropy < 60) return 'Hours';
  if (entropy < 80) return 'Years';
  return 'Centuries';
}
