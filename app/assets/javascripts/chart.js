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
      var station = e.target;
      console.log(station.__data__.properties.name);
      var station_id = station.__data__.properties.id;
      if ($(station).attr("class") === "station") {
        $('.clicked_sta').attr("class", "station");
        $('.station').css("fill", "orange");
        $(station).attr("class", "station clicked_sta");
        $(station).css("fill", "lightblue");
        // makeCumLinData(chartYear, station_id);
        makeMultiBarChartData(chartYear, station_id);

      } else if ($(station).attr("class") === "station clicked_sta") {
        $(station).attr("class", "station");
        $(station).css("fill", "orange");
      } else {
        console.log("clicked something else");
      }
      });

    $html.on('mouseover.station', function(e) {
      var station = e.target;
      if ($(station).attr("class") === "station") {
        $(station).css("fill", "white");
      }
    });

    $html.on('mouseout.station', function(e) {
      var station = e.target;
      if ($(station).attr("class") === "station") {
        $(station).css("fill", "orange");
      }
    });


    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      e.preventDefault();
      var $self = $(this);
      var $dropdown = $self.parents('.js-dropdown');
      $dropdown.find('.js-dropdown__input').val($self.data('dropdown-value'));
      var year = $self.data('dropdown-value');
      $dropdown.find('.js-dropdown__current').text($self.text());
      makeMultiBarChartData(year, chartStation);

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


  function makecCumulativeLineChart(data) {
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

      return chart;
    });
  }

  var endpoint, chartData, numCharts;
  var chartYear = 2015;
  var chartStation = 8;

  function makeCumLinData(year, station) {
    chartYear = year;
    chartStation = station;
    chartData = [];

      endpoint = '/api/reservoirs/daily_by_year/' + chartStation + '/' + chartYear;
      d3.json(endpoint, function(error, data) {

        var levels = formatLevels(data);

        chartData.push({
          key: data.reservoir,
          values: levels
        });
      });

      setTimeout( function () {
        makeCumulativeLineChart(chartData);
        console.log("waiting")}, 2000);

  }

  function makeMultiBarChartData(year, station) {
    chartYear = year;
    chartStation = station;

    endpoint = '/api/reservoirs/monthly_av_vs_capacity/' + chartStation + '/' + chartYear;
    d3.json(endpoint, function(error, data) {

    $('.beachball').css('z-index', '90');
    setTimeout( function () {
      makeMultiBarChart(data);
      console.log("waiting")}, 2000);
    });

    updateLabel(station, year);

  }

  function updateLabel(station, year) {
    var stationInfo = '/api/reservoirs/' + station;
    $.getJSON( stationInfo, function( data ) {
      console.log(data);
      $('.res-name').text(data.name);
      $('.res-year').text(year);
      $('.res-county').text(data.county + " County");
      $('.res-max').text(data.max_capacity);
      $('.res-hr').text(data.hydrologic_area);


      // $( "<ul/>", {
      //   "class": "my-new-list",
      //   html: items.join( "" )
      // }).appendTo( "body" );
    });
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

  function makeMultiBarChart(data) {
    nv.addGraph({

          generate: function() {
              var width = ($('#chart').attr('width')),
                  height = ($('#chart').attr('height'));

                  id = "averagesByMonth"

              var chart = nv.models.multiBarChart()
                  .width(width)
                  .height(height)
                  .stacked(false)
                  .showControls(false)
                  .yDomain([0,1]);
              chart.reduceXTicks(false);
              chart.color([ '#06939c', '#263344']);

              chart.yAxis
                  .tickFormat(d3.format('%'));

              chart.dispatch.on('renderEnd', function(){
                  console.log('Render Complete');
                  $('.beachball').css('z-index', '0');
              });
              var svg = d3.select('#chart svg').datum(data);
              console.log('calling chart');
              svg.transition().duration(0).call(chart);
              return chart;
          },
          callback: function(graph) {
              nv.utils.windowResize(function() {
                  var width = ($('#chart').attr('width'));
                  var height = ($('#chart').attr('height'));
                  graph.width(width).height(height);
                  d3.select('#chart svg')
                      .attr('width', width)
                      .attr('height', height)
                      .transition().duration(0)
                      .call(graph);
              });
          }
      });
    }

  makeMultiBarChartData(chartYear, chartStation);

});
