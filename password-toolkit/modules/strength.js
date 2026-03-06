import { estimateEntropy, entropyToCrackTime } from './entropy.js';

export const SCORE_LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

export function evaluatePassword(password) {
  if (!password) {
    return {
      score: 0,
      scoreLabel: SCORE_LABELS[0],
      entropy: 0,
      estimatedCrackTime: 'Instant',
      zxcvbnCrackTime: 'Instant',
      feedback: ['Too short']
    };
  }

  const result = zxcvbn(password);
  const entropy = estimateEntropy(password);
  const feedback = [
    ...(result.feedback.warning ? [result.feedback.warning] : []),
    ...(result.feedback.suggestions || [])
  ].filter(Boolean);

  return {
    score: result.score,
    scoreLabel: SCORE_LABELS[result.score],
    entropy,
    estimatedCrackTime: entropyToCrackTime(entropy),
    zxcvbnCrackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    feedback: feedback.length ? feedback : ['Great password strength.']
  };
}
