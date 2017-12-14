const KeyPressed = {
  _pressed: {},

  UP: 38,
  DOWN: 40,
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
