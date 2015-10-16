$(document).ready(function() {
  (function($, window, document, undefined) {

    'use strict';

  	var $html = $('html');

    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown', function(e) {
      e.preventDefault();
      $(this).toggleClass('is-open');
    });

    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      e.preventDefault();
      var $self = $(this);
      var $dropdown = $self.parents('.js-dropdown');
      $dropdown.find('.js-dropdown__input').val($self.data('dropdown-value'));
      var year = $self.data('dropdown-value');
      $dropdown.find('.js-dropdown__current').text($self.text());
      makeData(year);

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

  // var chartYear = "2014";


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

  function makeData(chartYear) {

    // console.log( typeof chartYear);
    numCharts = 3;
    chartData = [];

    for (var i = 1; i <= numCharts; i++) {
      endpoint = 'api/reservoirs/daily_by_year/' + i + '/' + chartYear;
      // console.log(endpoint);
      d3.json(endpoint, function(error, data) {

        var levels = formatLevels(data);
        // console.log(levels);

        chartData.push({
          key: data.reservoir,
          values: levels
        });
        console.log(chartData);
      });

      if (i === numCharts) {
        setTimeout( function () {
          makeChart(chartData);
          console.log("waiting")}, 1000);
        console.log("last" );
        console.log( chartData);

      }
    };

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
  makeData(2014);
  // makeChart(chartData);

});
