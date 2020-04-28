import {
  onAttemptLogin,
  onAttemptGoogleLogin,
  onAttemptSignup,
  onAttemptGoogleSignup
} from './popup';

const authPopup = document.querySelector('.auth');
const signinBtn = document.querySelector('#signin');
const signupBtn = document.querySelector('#signup');
const loginFields = document.querySelectorAll('.auth-login-input');
const signupFields = document.querySelectorAll('.auth-signup-input');
const signinSubmit = document.querySelector('#signin-btn');
const gsigninSubmit = document.querySelector('#g-signin');
const signupSubmit = document.querySelector('#signup-btn');
const gsignupSubmit = document.querySelector('#g-signup');

const noop = () => {
};

const bindInputsToSubmit = () => {
  loginFields.forEach(el => el.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      signinSubmit.click();
    }
  }));

  signupFields.forEach(el => el.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      signupSubmit.click();
    }
  }));
};

export const showModal = (type = 'signin', videoURL, videoAttr, videoThumbnail, videoVariants) => {
  const classToAdd = type;
  const classToRemove = classToAdd === 'signin' ? 'signup' : 'signin';
  if (type === 'signin' || type === 'signup') {
    authPopup.classList.remove('invisible', classToRemove);
    authPopup.classList.add(classToAdd);
  } else if (type === 'contact') {
    contactPopup.classList.remove('invisible', classToRemove);
    contactPopup.classList.add(classToAdd);
  }
};

export const addAuthEventListeners = () => {
  signinBtn.addEventListener('click', showModal.bind(null, 'signin'));
  signupBtn.addEventListener('click', showModal.bind(null, 'signup'));
  bindInputsToSubmit();
};

export const removeAuthEventListeners = () => {
  [signinBtn, signupBtn].forEach(el => el.removeEventListener('click', noop));
};

export const disableButtons = () => {
  [signinSubmit, gsigninSubmit, signupSubmit, gsignupSubmit].forEach(btn => {
    btn.setAttribute('disabled', 'true');
  });
  signinSubmit.removeEventListener('click', onAttemptLogin);
  gsigninSubmit.removeEventListener('click', onAttemptGoogleLogin);
  signupSubmit.removeEventListener('click', onAttemptSignup);
  gsignupSubmit.removeEventListener('click', onAttemptGoogleSignup);
};

export const enableButtons = () => {
  [signinSubmit, gsigninSubmit, signupSubmit, gsignupSubmit].forEach(btn => {
    btn.removeAttribute('disabled');
  });
  signinSubmit.addEventListener('click', onAttemptLogin);
  gsigninSubmit.addEventListener('click', onAttemptGoogleLogin);
  signupSubmit.addEventListener('click', onAttemptSignup);
  gsignupSubmit.addEventListener('click', onAttemptGoogleSignup);
};

export const onAuthProcessing = (type = 'signin') => {
  removeAuthEventListeners();
  disableButtons();
  if (type === 'signin') {
    signinSubmit.innerText = 'Logging in...';
  } else if (type === 'signup') {
    signupSubmit.innerText = 'Creating your account...';
  }
};

export const onAuthProcessed = () => {
  addAuthEventListeners();
  enableButtons();
  signinSubmit.innerText = 'Log in';
  signupSubmit.innerText = 'Create an account';
};