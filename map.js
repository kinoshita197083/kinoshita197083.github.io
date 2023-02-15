// The svg
var svg_map = d3.select("#map-dataviz"),
    width3 = +svg_map.attr("width"),
    height3 = +svg_map.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width3 / 2, height3 / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeReds[3]);

var tooltip_3 = d3.select("#map-label")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "120px")
    .style("position", "absolute");

// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/kinoshita197083/Data_visualisation_project/master/world_population_joined2.csv", function (d) { data.set(d.code, +d.new_cases); })
    .await(ready);

function ready(error, topo) {

    var mouseOver = function (d) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5)
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black");

        tooltip_3
            .html("Country: " + d.properties.name + "<br> Cases: " + d.total)
            .style("opacity", 1);

        console.log(d)

    }

    var mouseLeave = function (d) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8)
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent");

        tooltip_3
            .style("opacity", 0)
    }

    var mousemove = function (d) {
        tooltip_3
            .style("left", d3.mouse(this)[0] + 50 + "px")
            .style("top", d3.mouse(this)[1] + "px");

    }

    // Draw the map
    svg_map.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )

        .attr("fill", function (d) {
            console.log(d)
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function (d) { return "Country" })
        .style("opacity", .8)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("mousemove", mousemove)
}