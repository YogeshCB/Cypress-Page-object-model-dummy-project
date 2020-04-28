export default class Radio {
  constructor(elmt) {
    this.field = elmt;
  }

  getValue() {
    const buttons = this.field.querySelectorAll('input[type="radio"]');
    let selectedButton;
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].checked) {
        selectedButton = buttons[i];
        break;
      }
    }
    return typeof selectedButton !== 'undefined' ? selectedButton.value : undefined;
  }
}