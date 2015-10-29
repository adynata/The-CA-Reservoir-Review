var stateModule = (function () {
  var state = "ss"; // Private Variable

  var pub = {};// public object - returned at end of module

  pub.changeState = function (newstate) {
      state = newstate;
      console.log(state);
  };

  pub.getState = function() {
      return state;
  }

  return pub; // expose externally
}());
