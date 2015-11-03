$(document).ready(function() {
    'use strict';

  	var $html = $('html');
    var address = "";
    //  'https://ca-reservoir-review.herokuapp.com';

    jQuery.fn.d3Click = function () {
      this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        e.dispatchEvent(evt);
      });
    };

    $('.ss').css('background-color', '#d1bf71');

    $('.ss').on("click", function(){
      $('.station').css("fill","#fed352");
      $('#' + lastId).css("fill","#2371cc");
      $('.active').d3Click();
      $('#map-selection ul li').css('background-color', 'powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.ss').css('background-color', '#d1bf71');
      makeMultiBarChartData(chartYear, chartStation);
    });

    $('.hr').on("click", function(){
      $('#map-selection ul li').css('background-color', 'powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.hr').css('background-color', '#d1bf71');
      $('.station').css("fill", "#fed352");
      $('.beachball').show();
      $('#' + defaultRegion).d3Click();
      makeHRData();
    });

    $('.all').on("click", function(){
      $('#map-selection ul li').css('background-color', 'powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.all').css('background-color', '#d1bf71');
    });



    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown', function(e) {
      e.preventDefault();
      $(this).toggleClass('is-open');
    });

    $html.on('click.station', function(e) {
      e.preventDefault();
      if (stateModule.getState() === "ss") {
        var station = e.target;
        // console.log(station.__data__.properties.id);

        var station_id = station.__data__.properties.id;
        if ($(station).attr("class") === "station") {
          lastId = $(station).attr("id");
          $('.clicked_sta').attr("class", "station");
          $('.station').css("fill", "#fed352");
          $(station).attr("class", "station clicked_sta");
          $(station).css("fill", "#2371cc");
          // makeCumLinData(chartYear, station_id);
          makeMultiBarChartData(chartYear, station_id);

        } else if ($(station).attr("class") === "station clicked_sta") {
          $(station).attr("class", "station");
          $(station).css("fill", "#fed352");
        } else {
          console.log("clicked something else");
        }
      }
    });

    $html.on('click.hydro_reg', function(e) {
      e.preventDefault();
      if (stateModule.getState() === "hr" && ($(e.target).attr("class") === "hydro_reg active"))
      {
        if ($(e.target).attr("id") !== 'SacramentoRiver') {
          console.log($(e.target).attr("class"));
          $('#SacramentoRiver').attr("class", "hydro_reg");

        }
        $(".hydro_reg active").attr("class", "hydro_reg");
        $(e.target).attr("class",  "hydro_reg active");
        var region = e.target.__data__.id;
        defaultRegion = region.replace(/ /g,'');

        makeHRData();
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
        $(station).css("fill", "#fed352");
      }
    });


    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      e.preventDefault();
      var $self = $(this);
      var $dropdown = $self.parents('.js-dropdown');
      $dropdown.find('.js-dropdown__input').val($self.data('dropdown-value'));
      var year = $self.data('dropdown-value');
      chartYear = year;
      $dropdown.find('.js-dropdown__current').text($self.text());
      if (stateModule.getState() === "ss") {
        makeMultiBarChartData(year, chartStation);
      } else if (stateModule.getState() === "hr") {
        makeHRData();
      } else if (stateModule.getState() === "hr") {
        console.log("go make that chart");
      } else {
        console.log("why are you in here?");
      }

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
      // console.log( data );

      d3.select('#chart svg')
        .datum(data)
        .call(chart);
        // console.log( data );

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

  var endpoint, chartData, numCharts;
  var chartYear = 2015;
  var chartStation = 8;
  var defaultRegion = "SacramentoRiver";
  var lastId = "OrovilleDam";

  function makeCumLinData(year, station) {
    chartYear = year;
    chartStation = station;
    chartData = [];

      endpoint = address + '/api/reservoirs/daily_by_year/' + chartStation + '/' + chartYear;
      d3.json(endpoint, function(error, data) {

        var levels = formatLevels(data);

        chartData.push({
          key: data.reservoir,
          values: levels
        });
      });

      eout( function () {
        makeCumulativeLineChart(chartData);
        console.log("waiting")}, 2000);

  }

  function makeMultiBarChartData(year, station) {
    chartYear = year;
    chartStation = station;

    endpoint = address + '/api/reservoirs/monthly_av_vs_capacity/' + chartStation + '/' + chartYear;
    d3.json(endpoint, function(error, data) {

    $('.beachball').show();
    setTimeout( function () {
      makeMultiBarChart(data);
      console.log("waiting")}, 2000);
    });

    updateLabelSs(station, year);

  }
//
  function makeHRData() {

    endpoint = address + '/api/reservoirs/by_hydrologic/' + defaultRegion.replace(/ /g,'');

    var hr = [];
    $.get(endpoint, function(data, status){
      $('.station').css("fill","#fed352");

      for ( var i = 0; i < data.length; i++) {
        (function(){
          var idName = data[i].name.replace(/ /g,'').replace(/ *\([^)]*\) */g, "");
          $('#'+idName).attr("class","station selected");
          $('#'+idName).css("fill","#2371cc");
          console.log($('#'+idName));
          var station_id = data[i].id;
          var station_endpoint = address + '/api/reservoirs/monthly_av_by_year/'+ station_id +'/'+ chartYear;
          (function(){$.get(station_endpoint, function(data, status) {
                hr.push(data);
          });})(station_endpoint);

        })(i);
      }
    });
    setTimeout( function () {
      $('.beachball').show();

      makeMultiBarChartHr(hr);


      console.log("waiting")}, 3000);



    updateLabelHr();

  }

  function updateLabelSs(station, year) {
    var stationInfo = address + '/api/reservoirs/' + station;
    $.getJSON( stationInfo, function( data ) {
      // console.log(data);
      $('.chart-info').css("display", "block");

      $('.res-name').text(data.name);
      $('.res-year').text(year);
      $('.res-county').text(data.county + " County");
      $('.res-max').text(data.max_capacity);
      $('.res-hr').text(data.hydrologic_area);
    });
  }

  function updateLabelHr() {
    $('.res-name').text(defaultRegion);
    $('.res-year').text(chartYear);
    $('.res-county').text("");
    $('.res-max').text("");
    $('.res-hr').text("");
    $('.chart-info').css("display", "none");
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
    $('#chart2').hide();
    $('#chart').fadeIn(1000);

    nv.addGraph({

          generate: function() {
              var width = ($('#chart').attr('width')),
                  height = ($('#chart').attr('height'));


              var chart = nv.models.multiBarChart()
                  .width(width)
                  .height(height)

                  chart.stacked(false)
                  .showControls(false)
                  .yDomain([0,1]);

                  chart.yAxis.tickFormat(d3.format('%'));

                  chart.color([ '#2371cc', '#263344']);

              chart.reduceXTicks(false);

              chart.dispatch.on('renderEnd', function(){
                  console.log('Render Complete');
                  $('.beachball').hide();


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

  function makeMultiBarChartHr(data) {
    $('#chart').hide();
    $('#chart2').fadeIn(1000);

    nv.addGraph({

        generate: function() {
          var width = ($('#chart2').attr('width')),
              height = ($('#chart2').attr('height'));

            var chart = nv.models.multiBarChart()
                .width(width)
                .height(height)
                .stacked(true)
                .showControls(true);

            chart.reduceXTicks(false);

            chart.yAxis
                .tickFormat(d3.format('.1f'));

            chart.color(['#532971', '#FFC247', '#B87B00', '#734D00', '#01959C', '#3a740c', '#30A4A9', '#016A6F', '#004346', '#FF7600', '#FFC592', '#FF9C47', '#B85500', '#733500', '#1140AC', '#839BD4', '#4165B7', '#0A2C7B', '#041A4D']);


            chart.dispatch.on('renderEnd', function(){
                console.log('Render Complete');
                $('.beachball').hide();

            });
            var svg = d3.select('#chart2 svg').datum(data);
            console.log('calling chart');
            svg.transition().duration(0).call(chart);
            return chart;
        },
        callback: function(graph) {
            nv.utils.windowResize(function() {
              var width = ($('#chart2').attr('width'));
              var height = ($('#chart2').attr('height'));
                graph.width(width).height(height);
                d3.select('#chart2 svg')
                    .attr('width', width)
                    .attr('height', height)
                    .transition().duration(0)
                    .call(graph);
            });
        }
    });
    }
  $('#chart2').hide();
  // makeMultiBarChartData(chartYear, chartStation);


  setTimeout( function () {
    $("#OrovilleDam").click();


    console.log("waiting")}, 3000);

});
