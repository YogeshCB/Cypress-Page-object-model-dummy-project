import Field from './field';
import { isValidEmail } from '../lib/utils';
import { onLogin, onSignup } from './auth';
import {
  onAuthProcessing,
  onAuthProcessed,
  enableButtons as enableFormSubmitButtons
} from './util'

let signinFormEl, signupFormEl, signinTriggerBtn, signupTriggerBtn, currentForm, focusedElmt;
const fields = {
  'signin': {},
  'signup': {},
};

export function initialize(form) {
  currentForm = form;
  signinTriggerBtn = document.querySelector('#login');
  signinFormEl = document.querySelector('#signin-form');
  signupFormEl = document.querySelector('#signup-form');

  fields.signin.email = new Field(signinFormEl.querySelector('#signin-email'));
  fields.signin.email.on('focus', onFieldFocus.bind(null, 'signin', 'email'));
  fields.signin.email.on('blur', onFieldBlur);

  fields.signin.password = new Field(signinFormEl.querySelector('#signin-pass'));
  fields.signin.password.on('focus', onFieldFocus.bind(null, 'signin', 'password'));
  fields.signin.password.on('blur', onFieldBlur);

  fields.signup.email = new Field(signupFormEl.querySelector('#signup-email'));
  fields.signup.email.on('focus', onFieldFocus.bind(null, 'signup', 'email'));
  fields.signup.email.on('blur', onFieldBlur);

  fields.signup.password = new Field(signupFormEl.querySelector('#signup-pass'));
  fields.signup.password.on('focus', onFieldFocus.bind(null, 'signup', 'password'));
  fields.signup.password.on('blur', onFieldBlur);

  enableFormSubmitButtons();
}

const onFieldFocus = (type, field, e) => {
  fields[type][field].setError('');
  clearErrorStyle(fields[type][field]);
  focusedElmt = e.target.parentNode;
};

const onFieldBlur = () => focusedElmt = undefined;

const setErrorStyle = field => field.input.classList.add('err');

const clearErrorStyle = field => field.input.classList.remove('err');

const getFormData = (type) => {
  const data = {};
  for (let field in fields[type]) {
    data[field] = fields[type][field].getValue();
  }
  return data;
};

const validateForm = (type) => {
  const data = getFormData(type);
  const { email = '', password = '' } = data;
  let isValid = true;
  if (email.length === 0 || !isValidEmail(email)) {
    fields[type].email.setError('* Please enter a valid email');
    setErrorStyle(fields[type].email);
    isValid = false;
  } else {
    fields[type].email.setError('')
  }

  if (password.length === 0 || password.length < 6) {
    fields[type].password.setError('* Password must be atleast 6 chars in length');
    setErrorStyle(fields[type].password);
    isValid = false;
  } else {
    fields[type].password.setError('')
  }

  return isValid ? data : false;
};

export const onAttemptLogin = e => {
  const data = validateForm('signin');
  if (data) {
    onAuthProcessing();
    onLogin('email', data);
  }
}

export const onAttemptSignup = e => {
  const data = validateForm('signup');
  if (data) {
    onAuthProcessing('signup');
    onSignup('email', data);
  }
}

export const onAttemptGoogleLogin = () => {
  onAuthProcessing('google');
  onLogin('google');
}

export const onAttemptGoogleSignup = () => {
  onAuthProcessing('google');
  onSignup('google');
}
