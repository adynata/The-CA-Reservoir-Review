$(document).ready(function() {
    'use strict';

  	var $html = $('html');
    var address = "";
    //  'https://ca-reservoir-review.herokuapp.com';

    // console.log(stateModule);


    jQuery.fn.d3Click = function () {
      this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        console.log('d3 click!');
        e.dispatchEvent(evt);
      });
    };

    $('.ss').css('border-bottom', '5px solid #dea934');

    $('.ss').on("click", function(){
      $('.selected').attr("class", "station");
      $('.station').css("fill","#fed352");
      $('#' + lastId).css("fill","#2371cc");
      $('.active').d3Click();
      $('#map-selection ul li').css('border-bottom', '5px solid powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.ss').css('border-bottom', '5px solid #dea934');
      makeMultiBarChartData(chartYear, chartStation);
    });

    $('.hr').on('click', function(){
      console.log('CLICK!');
      $('#map-selection ul li').css('border-bottom', '5px solid powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.hr').css('border-bottom', '5px solid #dea934');
      $('.station').css("fill", "#fed352");
      $('.beachball').show();
      $('#' + defaultRegion).d3Click();
      // $('#' + defaultRegion).attr("class", "hydro_reg active");

      // console.log('ok, we are calling the function now');
      // makeHRData();
    });

    $('.all').on("click", function(){
      $('#map-selection ul li').css('border-bottom', '5px solid powderblue');
      var myClass = $(this).attr("class");
      stateModule.changeState(myClass);
      $('.all').css('border-bottom', '5px solid #dea934');
      $('.active').d3Click();
      $('.station').css("fill","#2371cc");
      makeAllStationData();
    });



    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown', function(e) {
      // e.preventDefault();
      $(this).toggleClass('is-open');
    });

    $html.on('click.station', function(e) {

        var station = e.target;
        console.log($(station).attr("class"));
      if (stateModule.getState() === "ss" &&
      $(station).attr("class") === ("station" || "station clicked_sta") ) {
        e.preventDefault();
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
      if (stateModule.getState() === "hr" && ($(e.target).attr("class") === ( "hydro_reg active" || "hydro_reg")))
      {
        if ($(e.target).attr("id") !== 'SacramentoRiver') {
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
      if ($(station).attr("class") === "station" && stateModule.getState() === "ss") {
        $(station).css("fill", "white");
      }
    });

    $html.on('mouseout.station', function(e) {
      var station = e.target;
      if ($(station).attr("class") === "station" && stateModule.getState() === "ss") {
        $(station).css("fill", "#fed352");
      }
    });


    $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      // e.preventDefault();
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
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1] })
        .color(d3.scale.category10().range())
        // .average(function(d) { return d.mean/100; })
        .duration(300)
        .clipVoronoi(false);
      chart.dispatch.on('renderEnd', function() {
        // console.log('render complete: cumulative line with guide line');
      });

      chart.xAxis.tickFormat(function(d) {
        return d3.time.format('%m/%d/%y')(new Date(d));
      });

      chart.yAxis.tickFormat(d3.format('d'));

      d3.select('#chart svg')
        .datum(data)
        .call(chart);

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
        }, 2000);

  }

  function makeMultiBarChartData(year, station) {
    chartYear = year;
    chartStation = station;

    var endpoint = address + '/api/reservoirs/monthly_av_vs_capacity/' + chartStation + '/' + chartYear;
    d3.json(endpoint, function(error, data) {
      $('.beachball').show();
      makeMultiBarChart(data);
    });

    updateLabelSs(station, year);

  }
//
  function makeHRData() {

    var endpoint = address + '/api/reservoirs/by_hydrologic/' + defaultRegion.replace(/ /g,'') + "/" + chartYear;

    var hr;

    $.get(endpoint, function(data, status) {
          hr = data;
          updateStations();
          $('.beachball').show();
          makeMultiBarChartHr(hr);
    });

    $('.station').css("fill","#fed352");

    function updateStations() {
      for ( var i = 0; i < hr.length; i++) {
        (function(i){
          var idName = hr[i].key.replace(/ /g,'').replace(/ *\([^)]*\) */g, "");
            $('#'+idName).attr("class","station selected");
            $('#'+idName).css("fill","#2371cc");
          })(i);
      }
    }
    updateLabelHr();
  }

  function updateLabelSs(station, year) {
    var stationInfo = address + '/api/reservoirs/' + station;
    $.getJSON( stationInfo, function( data ) {
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
  }

  function formatLevels(data) {
    var levels = data.levels.map(function(level) {
      var date, value;
      date = new Date(level[0]).getTime();
      value = level[1];
      return [date, value];
    }).sort(function(a, b) {
      return a[0] - b[0];
    });

    return levels;
  }

  function makeMultiBarChart(data) {
    $('#chart2').hide();
    $('#chartall').hide();
    $('#blankchart').show();
    $('#blankchart').css('z-index', '9');
    $('#chart').fadeIn(1000);

    nv.addGraph({

          generate: function() {
              var width = ($('#chart').attr('width')),
                  height = ($('#chart').attr('height'));


              var chart = nv.models.multiBarChart()
                  .width(width)
                  .height(height);

                  chart.stacked(false)
                  .showControls(false)
                  .yDomain([0,1]);

                  chart.yAxis.tickFormat(d3.format('%'));

                  chart.color([ '#2371cc', '#263344']);

              chart.reduceXTicks(false);

              chart.dispatch.on('renderEnd', function(){
                  $('.beachball').hide();
                  $('#blankchart').css('z-index', '0');

              });
              var svg = d3.select('#chart svg').datum(data);
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
    $('#chartall').hide();
    $('#blankchart').show();
    $('#blankchart').css('z-index', '9');
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
                $('.beachball').hide();
                $('#blankchart').css('z-index', '0');
            });
            var svg = d3.select('#chart2 svg').datum(data);
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


    function makeAllStationData() {
      var endpoint = address + "/api/reservoirs/all_stations_av_for_year/" + chartYear;

      $.get(endpoint, function(data, status) {
            $('.beachball').show();
            makeAllStationChart(data);
      });
      var percentage_endpoint = address + "/api/reservoirs/overall_average/" + chartYear;
      $.get(percentage_endpoint, function(data, status) {
          loadLiquidFillGauge("fillgauge1", Math.floor(data * 100));
      });

    }

    function makeAllStationChart(data) {
      $('#chart2').hide();
      $('#chart').hide();
      $('#blankchart').show();
      $('#blankchart').css('z-index', '9');
      $('#chartall').show();

      nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .showLabels(true)     //Display pie labels
            .showLegend(false)
            .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
            .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
            .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
            .donutRatio(0.25)     //Configure how big you want the donut hole size to be.
            ;
            chart.legend.updateState(false);

            chart.color(['#532971', '#FFC247', '#B87B00', '#734D00', '#01959C', '#3a740c', '#30A4A9', '#016A6F', '#004346', '#FF7600', '#FFC592', '#FF9C47', '#B85500', '#733500', '#1140AC', '#839BD4', '#4165B7', '#0A2C7B', '#041A4D']);

          d3.select("#chart4 svg")
              .datum(data)
              .transition().duration(350)
              .call(chart);
        return chart;
      });

      console.log('Render Complete');
      $('.beachball').hide();
      $('#blankchart').hide();
    }

    /*!
     * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
     * Copyright (c) 2015, Curtis Bratton
     * All rights reserved.
     *
     * Liquid Fill Gauge v1.1
     */
    function liquidFillGaugeDefaultSettings(){
        return {
            minValue: 0, // The gauge minimum value.
            maxValue: 100, // The gauge maximum value.
            circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
            circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
            circleColor: "#178BCA", // The color of the outer circle.
            waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
            waveCount: 1, // The number of full waves per width of the wave circle.
            waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
            waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
            waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
            waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
            waveAnimate: true, // Controls if the wave scrolls or is static.
            waveColor: "#178BCA", // The color of the fill wave.
            waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
            textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
            textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
            valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
            displayPercent: true, // If true, a % symbol is displayed after the value.
            textColor: "#045681", // The color of the value text when the wave does not overlap it.
            waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
        };
    }

    function loadLiquidFillGauge(elementId, value, config) {
        if(config == null) config = liquidFillGaugeDefaultSettings();

        var gauge = d3.select("#" + elementId);
        var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
        var locationX = parseInt(gauge.style("width"))/2 - radius;
        var locationY = parseInt(gauge.style("height"))/2 - radius;
        var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

        var waveHeightScale;
        if(config.waveHeightScaling){
            waveHeightScale = d3.scale.linear()
                .range([0,config.waveHeight,0])
                .domain([0,50,100]);
        } else {
            waveHeightScale = d3.scale.linear()
                .range([config.waveHeight,config.waveHeight])
                .domain([0,100]);
        }

        var textPixels = (config.textSize*radius/2);
        var textFinalValue = parseFloat(value).toFixed(2);
        var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
        var percentText = config.displayPercent?"%":"";
        var circleThickness = config.circleThickness * radius;
        var circleFillGap = config.circleFillGap * radius;
        var fillCircleMargin = circleThickness + circleFillGap;
        var fillCircleRadius = radius - fillCircleMargin;
        var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

        var waveLength = fillCircleRadius*2/config.waveCount;
        var waveClipCount = 1+config.waveCount;
        var waveClipWidth = waveLength*waveClipCount;

        // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
        var textRounder = function(value){ return Math.round(value); };
        if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(1); };
        }
        if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(2); };
        }

        // Data for building the clip wave area.
        var data = [];
        for(var i = 0; i <= 40*waveClipCount; i++){
            data.push({x: i/(40*waveClipCount), y: (i/(40))});
        }

        // Scales for drawing the outer circle.
        var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
        var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

        // Scales for controlling the size of the clipping path.
        var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
        var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

        // Scales for controlling the position of the clipping path.
        var waveRiseScale = d3.scale.linear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
            .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
            .domain([0,1]);
        var waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
            .domain([0,1]);

        // Scale for controlling the position of the text within the gauge.
        var textRiseScaleY = d3.scale.linear()
            .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
            .domain([0,1]);

        // Center the gauge within the parent SVG.
        var gaugeGroup = gauge.append("g")
            .attr('transform','translate('+locationX+','+locationY+')');

        // Draw the outer circle.
        var gaugeCircleArc = d3.svg.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius-circleThickness));
        gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform','translate('+radius+','+radius+')');

        // Text where the wave does not overlap.
        var text1 = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.textColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

        // The clipping wave area.
        var clipArea = d3.svg.area()
            .x(function(d) { return waveScaleX(d.x); } )
            .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
            .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
        var waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId);
        var wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea)
            .attr("T", 0);

        // The inner circle with the clipping wave attached.
        var fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");
        fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

        // Text where the wave does overlap.
        var text2 = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.waveTextColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

        // Make the value count up.
        if(config.valueCountUp){
            var textTween = function(){
                var i = d3.interpolate(this.textContent, textFinalValue);
                return function(t) { this.textContent = textRounder(i(t)) + percentText; };
            };
            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
        }

        // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
        var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
        if(config.waveRise){
            waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
                .transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
                .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
        } else {
            waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
        }

        if(config.waveAnimate) animateWave();

        function animateWave() {
            wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
            wave.transition()
                .duration(config.waveAnimateTime * (1-wave.attr('T')))
                .ease('linear')
                .attr('transform','translate('+waveAnimateScale(1)+',0)')
                .attr('T', 1)
                .each('end', function(){
                    wave.attr('T', 0);
                    animateWave(config.waveAnimateTime);
                });
        }

        function GaugeUpdater(){
            this.update = function(value){
                var newFinalValue = parseFloat(value).toFixed(2);
                var textRounderUpdater = function(value){ return Math.round(value); };
                if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                    textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
                }
                if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                    textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
                }

                var textTween = function(){
                    var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                    return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; };
                };

                text1.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);
                text2.transition()
                    .duration(config.waveRiseTime)
                    .tween("text", textTween);

                var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
                var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
                var waveRiseScale = d3.scale.linear()
                    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                    // circle at 100%.
                    .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                    .domain([0,1]);
                var newHeight = waveRiseScale(fillPercent);
                var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
                var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
                var newClipArea;
                if(config.waveHeightScaling){
                    newClipArea = d3.svg.area()
                        .x(function(d) { return waveScaleX(d.x); } )
                        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
                } else {
                    newClipArea = clipArea;
                }

                var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
                wave.transition()
                    .duration(0)
                    .transition()
                    .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                    .ease('linear')
                    .attr('d', newClipArea)
                    .attr('transform','translate('+newWavePosition+',0)')
                    .attr('T','1')
                    .each("end", function(){
                        if(config.waveAnimate){
                            wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                            animateWave(config.waveAnimateTime);
                        }
                    });
                waveGroup.transition()
                    .duration(config.waveRiseTime)
                    .attr('transform','translate('+waveGroupXPosition+','+newHeight+')');
            };
        }

        return new GaugeUpdater();
    }
  // var gauge1 = loadLiquidFillGauge("fillgauge1", 55);
  var config1 = liquidFillGaugeDefaultSettings();
  config1.circleColor = "#FF7777";
  config1.textColor = "#FF4444";
  config1.waveTextColor = "#FFAAAA";
  config1.waveColor = "#FFDDDD";
  config1.circleThickness = 0.2;
  config1.textVertPosition = 0.2;
  config1.waveAnimateTime = 2000;


  $('#chart2').hide();
  $('#chartall').hide();

  // makeMultiBarChartData(chartYear, chartStation);


  setTimeout( function () {
    $("#OrovilleDam").click();


    console.log("waiting");}, 2000);

});
