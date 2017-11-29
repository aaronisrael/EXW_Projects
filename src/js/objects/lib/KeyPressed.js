const KeyPressed = {
  _pressed: {},

  A: 38,
  D: 40,
  SPACE: 32,

  isDown(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup(event) {
    delete this._pressed[event.keyCode];
  }
};

export default KeyPressed;
