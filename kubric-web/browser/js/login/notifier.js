let wrapper, alert;

export const initialize = () => {
  wrapper = document.querySelector('.notifier');
  alert = wrapper.querySelector('.alert');
};

const onAnimationEnd = e => {
  if (e.animationName === 'slide') {
    wrapper.classList.add('done');
  } else if (e.animationName === 'retract') {
    wrapper.classList.remove('done');
    wrapper.classList.remove('retract');
    wrapper.classList.add('hide');
  }
};

export default (message, type = 'info') => {
  alert.innerHTML = message;
  wrapper.classList.remove('hide');
  alert.className = `alert alert-${type}`;
  wrapper.addEventListener('animationend', onAnimationEnd);
  setTimeout(() => {
    wrapper.classList.add('retract');
  }, 3000);
}