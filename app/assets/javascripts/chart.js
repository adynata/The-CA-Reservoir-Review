$(document).ready(function() {
  (function($, window, document, undefined) {

    'use strict';

  	var $html = $('html');

    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown', function(e) {
      e.preventDefault();
      $(this).toggleClass('is-open');
    });

    $html.on('click.station', function(e) {
      e.preventDefault();
      // console.log($(this).data);
      var station = e.target;
      console.log(station.__data__.properties.name);
      var station_id = station.__data__.properties.id;
      if ($(station).attr("class") === "station") {
        $('.clicked_sta').attr("class", "station");
        $('.station').css("fill", "orange");
        $(station).attr("class", "station clicked_sta");
        $(station).css("fill", "lightblue");
        makeData(chartYear, station_id);

      } else if ($(station).attr("class") === "station clicked_sta") {
        $(station).attr("class", "station");
        $(station).css("fill", "orange");
      } else {
        console.log("clicked something else");
      }
      console.log(document.getElementsByClassName('clicked_sta'));
      });

    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      e.preventDefault();
      var $self = $(this);
      var $dropdown = $self.parents('.js-dropdown');
      $dropdown.find('.js-dropdown__input').val($self.data('dropdown-value'));
      var year = $self.data('dropdown-value');
      $dropdown.find('.js-dropdown__current').text($self.text());
      makeData(year, chartStation);

    });

    $html.on('click.ui.dropdown tap.ui.dropdown', function(e) {
      var $target = $(e.target);
      if (!$target.parents().hasClass('js-dropdown')) {
        $('.js-dropdown').removeClass('is-open');
      }
    });

    $('.c_dropdown__item').on('click', function(){
      console.log("clicked");

  });

  })(jQuery, window, document);


  function makeChart(data) {
    console.log( data );

    nv.addGraph(function() {
      var chart = nv.models.cumulativeLineChart()
        .useInteractiveGuideline(true)
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] })
        .color(d3.scale.category10().range())
        // .average(function(d) { return d.mean/100; })
        .duration(300)
        .clipVoronoi(false);
      chart.dispatch.on('renderEnd', function() {
        console.log('render complete: cumulative line with guide line');
      });

      chart.xAxis.tickFormat(function(d) {
        return d3.time.format('%m/%d/%y')(new Date(d))
      });

      chart.yAxis.tickFormat(d3.format('d'));
      console.log( data );

      d3.select('#chart svg')
        .datum(data)
        .call(chart);
        console.log( data );

      nv.utils.windowResize(chart.update);

      // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
      // chart.state.dispatch.on('change', function(state){
      //   nv.log('state', JSON.stringify(state));
      // });

      return chart;
    });
  }
  var endpoint, chartData, numCharts;
  var chartYear = 2014;
  var chartStation = 8;

  function makeData(year, station) {
    chartYear = year;
    chartStation = station;
    // console.log( typeof chartYear);
    numCharts = 3;
    chartData = [];

    // for (var i = 1; i <= numCharts; i++) {
      endpoint = 'api/reservoirs/daily_by_year/' + chartStation + '/' + chartYear;
      // console.log(endpoint);
      d3.json(endpoint, function(error, data) {

        var levels = formatLevels(data);
        // console.log(levels);

        chartData.push({
          key: data.reservoir,
          values: levels
        });
        // console.log(chartData);
      });

      // if (i === numCharts) {
        setTimeout( function () {
          makeChart(chartData);
          console.log("waiting")}, 1000);

      // }
    // };

  }

  function formatLevels(data) {
    var levels = data.levels.map(function(level) {
      var date, value;
      date = new Date(level[0]).getTime();
      value = level[1];
      return [date, value]
    }).sort(function(a, b) {
      return a[0] - b[0];
    });

    return levels;
  }

  makeData(2014, 8);
  makeChart(chartData);

//   nv.addGraph(function() {
//     var chart = nv.models.multiBarChart()
//       // .transitionDuration(350)
//       .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
//       .rotateLabels(0)      //Angle to rotate x-axis labels.
//       .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
//       .groupSpacing(0.1)    //Distance between each group of bars.
//     ;
//
//     chart.xAxis
//         .tickFormat(d3.format(',f'));
//
//     chart.yAxis
//         .tickFormat(d3.format(',.1f'));
//
//     d3.select('#chart1 svg')
//         .datum(exampleData())
//         .call(chart);
//
//     nv.utils.windowResize(chart.update);
//
//     return chart;
// });
//
// //Generate some nice data.
// function exampleData() {
//   return stream_layers(3,10+Math.random()*100,.1).map(function(data, i) {
//     return {
//       key: 'Stream #' + i,
//       values: data
//     };
//   });
// }
//
//
//
//
//
//

});
