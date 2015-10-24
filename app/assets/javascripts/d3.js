$(document).ready(function() {



  var width = 500,
      height = 600,
      active = d3.select(null);
  var projection = d3.geo.albers()
      .scale(3000)
      .translate([width / 2.5, height / 2.5])
      .parallels([34, 40.5])
      .rotate([120,0]);
  var path = d3.geo.path()
      .projection(projection);
  var svg = d3.select("#map").append("svg");
  svg.append("rect")
      .attr("class", "background")
      .on("click", reset);


  // counties
  var co = svg.append("g").attr("id", "county");

  // d3.json("/json/caCountiesTopo.json", function(error, ca) {
  //   if (error) throw error;
    // svg.selectAll("path")
    //     .data(topojson.feature(ca, ca.objects.subunits).features)
    //   .enter().append("path")
    //     .attr("d", path)
    //     .attr("class", "county");
    //     // .on("click", clicked);

    co.append("path")
        .datum(topojson.mesh(caCountiesTopo, caCountiesTopo.objects.subunits, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        // .attr("class", "county-line")
        .attr("d", path);
  // });

  // statelines
  var a = svg.append("a")
      .style("stroke-width", "1px");

  // d3.json("/json/us.json", function(error, us) {
  //   if (error) throw error;

    a.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path)
        .attr("fill-opacity", "0.4")
        .attr("class", "states");
        // .on("click", clicked);

    a.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);
  // });



  //hydrologic regions
  var g = svg.append("g")
            .style("stroke-width", "1.5px");

  // d3.json("/json/hydro_regions.json", function(error, hr) {
  //   if (error) throw error;
    g.selectAll("path")
        .data(topojson.feature(hydro_regions, hydro_regions.objects.hydrologic_regions_ca).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "hydro_reg")
        .attr("fill-opacity", "0.4")
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(hydro_regions, hydro_regions.objects.hydrologic_regions_ca, function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);

  // });



  // station point data
  var sta = svg.append("g").attr("id", "sta").style("stroke-width", ".5px");
  sta.selectAll("path")
    .data(sta_json.features)
    .enter()
    .append( "path" )
    .attr( "d", path.pointRadius(3) )
    .attr("class", "station")
    // mouseover functions
    .on("mouseover", function(feature) {
      var props = feature.properties;

      // console.log(feature)
      div.transition()
        .duration(200)
        .style("opacity", .95);
      div.html('Reservoir: ' + props.name, 'County: ' + props.county)
        .style("left", (d3.event.pageX) + 16 + "px")
        .style("top", (d3.event.pageY - 845) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0.0);
    })
    .on("click", clickedSta);

    // tooltip information
    var div = d3.select("#map").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
  a.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  g.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  sta.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  co.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

}

function reset() {
  active.classed("active", false);
  active = d3.select(null);
  g.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
  a.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
  sta.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
  co.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}

function clickedSta(d) {
  if (active.node() === this) return resetSta();
  active.classed("active", false);
}

function resetSta() {
  active.classed("active", false);
  active = d3.select(null);
}

});
