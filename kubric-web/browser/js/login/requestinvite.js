import Field from './field';
import addNotification from './notifier';
import { isValidEmail, isValidURL, postData, isMobile } from '../lib/utils';

let requestFormElmt, contentElmt, requestBtn, normalWindowHeight, contentHeight, focusedElmt;
const fields = {};

export const initialize = () => {
  requestFormElmt = document.querySelector('.contact');
  requestBtn = requestFormElmt.querySelector('.demo-request-btn');
  requestBtn.addEventListener('click', onSendInvite);
  fields.name = new Field(requestFormElmt.querySelector('#name'));
  fields.name.on('focus', onFieldFocus.bind(null, 'name'));
  fields.name.on('blur', onFieldBlur);
  fields.email = new Field(requestFormElmt.querySelector('#email'));
  fields.email.on('focus', onFieldFocus.bind(null, 'email'));
  fields.email.on('blur', onFieldBlur);
  fields.website = new Field(requestFormElmt.querySelector('#website'));
  fields.website.on('focus', onFieldFocus.bind(null, 'website'));
  fields.website.on('blur', onFieldBlur);
  normalWindowHeight = window.innerHeight;
  initializeHeaderRequest();
}; 

const updateFormPosition = newBottom => requestAnimationFrame(() => contentElmt.style.bottom = `${newBottom}px`);

const onHide = () => isMobile() ? updateFormPosition(-contentHeight) : requestFormElmt.classList.add('invisible');

const onFieldFocus = (field, e) => {
  fields[field].clearError();
  focusedElmt = e.target.parentNode;
};

const onFieldBlur = () => focusedElmt = undefined;

const getFormData = () => {
  const data = {};
  for (let field in fields) {
    data[field] = fields[field].getValue();
  }
  return data;
};

const validateForm = () => {
  const data = getFormData();
  const { email = '', name = '', website = '' } = data;
  let isValid = true;
  if (name.length === 0) {
    fields.name.setError('* Please enter your name');
    isValid = false;
  }
  if (email.length === 0 || !isValidEmail(email)) {
    fields.email.setError('* Please enter a valid email');
    isValid = false;
  }
  if (website.length === 0 || !isValidURL(website)) {
    fields.website.setError('* Please enter a valid website');
    isValid = false;
  }
  return isValid ? data : false;
};

const onSendInvite = e => {
  const data = validateForm(data);
  if (data) {
    postData('/mail/invite', {
      data,
    });
    notifySuccess();
    onHide();
  }
};

const sendRequestMail = () => {
  const emailEl = document.querySelector('#rdemo-email');
  const email = getHeaderRequestData(emailEl);
  if (email !== false && email.length) {
    postData('/mail/invite', {
      data: { email }
    });
    notifySuccess();
    emailEl.value = '';
  }
};


const sendRequestMailFooter = () => {
  const emailEl = document.querySelector('#rdemo-email-footer');
  const email = getHeaderRequestData(emailEl);
  if (email !== false && email.length) {
    postData('/mail/invite', {
      data: { email }
    });
    notifySuccess();
    emailEl.value = '';
  }
};

const initializeHeaderRequest = () => {
  const emailEl = document.querySelector('#rdemo-email');
  const submitEl = document.querySelector('#rdemo-btn');
  const submitFooterEl = document.querySelector('#rdemo-btn-footer');

  submitEl.removeAttribute('disabled');
  submitEl.addEventListener('click', sendRequestMail);
  submitFooterEl.addEventListener('click', sendRequestMailFooter);
  emailEl.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      sendRequestMail();
    }
  });
};

const getHeaderRequestData = (el) => {
  const email = el.value.trim();
  return isValidEmail(email) ? email : false;
};

const notifySuccess = () => {
  addNotification('We have received your request. You will hear from us shortly.');
};

export default () => {
  requestFormElmt.classList.remove('invisible');
  isMobile() && updateFormPosition(0);
};