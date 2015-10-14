$(document).ready(function() {

  var endpoint = 'api/reservoirs/daily_by_year/6/2014';

  d3.json(endpoint, function(error, data) {

    var levels = data.levels.map(function(level) {
      var date, value;
      date = new Date(level[0]).getTime();
      value = level[1];
      return [date, value]
    }).sort(function(a, b) {
      return a[0] - b[0];
    });

    var newDatum = [{
      key: data.reservoir,
      values: levels
    }];

    console.log(newDatum)

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

      d3.select('#chart svg')
        .datum(newDatum)
        .call(chart);

      nv.utils.windowResize(chart.update);

      // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
      // chart.state.dispatch.on('change', function(state){
      //   nv.log('state', JSON.stringify(state));
      // });

      return chart;
    });

  });

});