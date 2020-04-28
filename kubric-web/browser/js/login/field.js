export default class Field {
  constructor(elmt) {
    this.field = elmt;
    this.input = this.field.querySelector('.input');
    this.error = this.field.querySelector('.error');
    this.input.addEventListener('keyup', ::this.onKeyUp);
  }

  onKeyUp(e) {
    let fnName = 'remove';
    if (e.target.value.length > 0) {
      fnName = 'add';
    }
    this.input.classList[fnName]('hasvalue');
  }

  getValue() {
    return this.input.value;
  }

  setError(message) {
    this.error.innerText = message;
    this.field.classList.add('error');
  }

  clearError() {
    this.field.classList.remove('error');
  }

  on(event, handler) {
    this.input.addEventListener(event, handler);
  }
}