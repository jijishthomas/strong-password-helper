import { generatePassword, generateMultiplePasswords } from './modules/generator.js';
import { generatePassphrase } from './modules/passphrase.js';
import { evaluatePassword } from './modules/strength.js';

const elements = {
  passwordInput: document.querySelector('#password-input'),
  togglePassword: document.querySelector('#toggle-password'),
  strengthBar: document.querySelector('#strength-bar'),
  scoreValue: document.querySelector('#score-value'),
  scoreLabel: document.querySelector('#score-label'),
  entropyValue: document.querySelector('#entropy-value'),
  crackTimeValue: document.querySelector('#crack-time-value'),
  zxcvbnCrackTime: document.querySelector('#zxcvbn-crack-time'),
  feedbackList: document.querySelector('#feedback-list'),

  generatedPassword: document.querySelector('#generated-password'),
  lengthSlider: document.querySelector('#length-slider'),
  lengthValue: document.querySelector('#length-value'),
  includeUppercase: document.querySelector('#include-uppercase'),
  includeLowercase: document.querySelector('#include-lowercase'),
  includeNumbers: document.querySelector('#include-numbers'),
  includeSymbols: document.querySelector('#include-symbols'),
  avoidSimilar: document.querySelector('#avoid-similar'),
  avoidAmbiguous: document.querySelector('#avoid-ambiguous'),
  generatePasswordBtn: document.querySelector('#generate-password-btn'),
  generateMultipleBtn: document.querySelector('#generate-multiple-btn'),
  passwordBatch: document.querySelector('#password-batch'),
  copyPasswordBtn: document.querySelector('#copy-password-btn'),

  passphraseOutput: document.querySelector('#passphrase-output'),
  wordsRange: document.querySelector('#words-range'),
  wordsValue: document.querySelector('#words-value'),
  separatorSelect: document.querySelector('#separator-select'),
  capitalizeWords: document.querySelector('#capitalize-words'),
  addNumberSuffix: document.querySelector('#add-number-suffix'),
  generatePassphraseBtn: document.querySelector('#generate-passphrase-btn'),
  copyPassphraseBtn: document.querySelector('#copy-passphrase-btn'),

  themeToggle: document.querySelector('#theme-toggle')
};

function getGeneratorOptions() {
  return {
    length: Number(elements.lengthSlider.value),
    includeUppercase: elements.includeUppercase.checked,
    includeLowercase: elements.includeLowercase.checked,
    includeNumbers: elements.includeNumbers.checked,
    includeSymbols: elements.includeSymbols.checked,
    avoidSimilar: elements.avoidSimilar.checked,
    avoidAmbiguous: elements.avoidAmbiguous.checked
  };
}

function renderStrength() {
  const password = elements.passwordInput.value;
  const { score, scoreLabel, entropy, estimatedCrackTime, zxcvbnCrackTime, feedback } = evaluatePassword(password);

  elements.strengthBar.style.width = `${((score + 1) / 5) * 100}%`;
  elements.strengthBar.dataset.score = String(score);
  elements.scoreValue.textContent = String(score);
  elements.scoreLabel.textContent = scoreLabel;
  elements.entropyValue.textContent = `${entropy.toFixed(1)} bits`;
  elements.crackTimeValue.textContent = estimatedCrackTime;
  elements.zxcvbnCrackTime.textContent = zxcvbnCrackTime;

  elements.feedbackList.innerHTML = '';
  feedback.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    elements.feedbackList.appendChild(li);
  });
}

function renderPassword() {
  const password = generatePassword(getGeneratorOptions());
  elements.generatedPassword.value = password;
}

function renderPasswordBatch() {
  const list = generateMultiplePasswords(getGeneratorOptions(), 5);
  elements.passwordBatch.innerHTML = '';
  list.forEach((value) => {
    const item = document.createElement('li');
    item.textContent = value;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Use generated password ${value}`);
    item.addEventListener('click', () => {
      elements.generatedPassword.value = value;
    });
    elements.passwordBatch.appendChild(item);
  });
}

function renderPassphrase() {
  const separatorMap = {
    dash: '-',
    underscore: '_',
    space: ' '
  };

  elements.passphraseOutput.value = generatePassphrase({
    words: Number(elements.wordsRange.value),
    separator: separatorMap[elements.separatorSelect.value],
    capitalize: elements.capitalizeWords.checked,
    numberSuffix: elements.addNumberSuffix.checked
  });
}

async function copyToClipboard(value, button) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
  button.classList.add('copied');
  const originalText = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => {
    button.classList.remove('copied');
    button.textContent = originalText;
  }, 1200);
}

function initializeTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.checked = theme === 'dark';
}

function bindEvents() {
  elements.passwordInput.addEventListener('input', renderStrength);
  elements.togglePassword.addEventListener('click', () => {
    const isPassword = elements.passwordInput.type === 'password';
    elements.passwordInput.type = isPassword ? 'text' : 'password';
    elements.togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  });

  elements.lengthSlider.addEventListener('input', () => {
    elements.lengthValue.textContent = elements.lengthSlider.value;
    renderPassword();
  });

  [
    elements.includeUppercase,
    elements.includeLowercase,
    elements.includeNumbers,
    elements.includeSymbols,
    elements.avoidSimilar,
    elements.avoidAmbiguous
  ].forEach((input) => input.addEventListener('change', renderPassword));

  elements.generatePasswordBtn.addEventListener('click', renderPassword);
  elements.generateMultipleBtn.addEventListener('click', renderPasswordBatch);
  elements.copyPasswordBtn.addEventListener('click', () => copyToClipboard(elements.generatedPassword.value, elements.copyPasswordBtn));

  elements.wordsRange.addEventListener('input', () => {
    elements.wordsValue.textContent = elements.wordsRange.value;
    renderPassphrase();
  });

  [elements.separatorSelect, elements.capitalizeWords, elements.addNumberSuffix].forEach((input) => {
    input.addEventListener('change', renderPassphrase);
  });

  elements.generatePassphraseBtn.addEventListener('click', renderPassphrase);
  elements.copyPassphraseBtn.addEventListener('click', () => copyToClipboard(elements.passphraseOutput.value, elements.copyPassphraseBtn));

  elements.themeToggle.addEventListener('change', () => {
    const nextTheme = elements.themeToggle.checked ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  });
}

function init() {
  initializeTheme();
  bindEvents();

  elements.lengthValue.textContent = elements.lengthSlider.value;
  elements.wordsValue.textContent = elements.wordsRange.value;

  renderStrength();
  renderPassword();
  renderPasswordBatch();
  renderPassphrase();
}

init();
