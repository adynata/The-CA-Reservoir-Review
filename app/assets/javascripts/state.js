var chartState = (function () {
  var state = "ss";
  var lastStation = "";
  var lastHydro = "";
  var lastYear = 2015;

  var pub = {};

  pub.changeState = function (newstate) {
      state = newstate;
  };

  pub.getState = function() {
      return state;
  };

  pub.changeStation = function(newStation) {
    lastStation = newStation;
  };

  pub.changeHR = function(newHR) {
    lastHydro = newHR;
  };

  pub.changeYear = function(newYear) {
    lastYear = newYear;
  };

  pub.getStation = function() {
      return lastStation;
  };

  pub.getHR = function() {
      return lastHydro;
  };

  pub.getYear = function() {
      return lastYear;
  };

  return pub;

})();
