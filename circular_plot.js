// set the dimensions and margins of the graph
var margin = { top: 30, right: 0, bottom: 0, left: 0 },
    width = 430 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 30,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

if (window.innerWidth <= 800) {
    width = 330;
    height = 440;
    // svg_circular.style("transform", "translate(" + 10 + "," + 100 + ")");
}

// append the svg object
var svg_circular = d3.select("#circular-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

//Construct tooltip
var tooltip_2 = d3.select("#circular_plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "400px")
    .style("position", "absolute")

d3.csv("https://raw.githubusercontent.com/kinoshita197083/Data_visualisation_project/master/Death_Toll_Flu_All_3.csv", function (data) {

    // Scales
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X-axis from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(data.map(function (d) { return d.FluType; })); // Domain of X-axis = the list of states.
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Come back for the domain later
        .domain([0, 14000]); // Domain (Y): from 0 to the max seen in the data

    // Add the bars
    svg_circular.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "#4863A0")
        .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) { return y(d['Death/Million(AVG)'] * 150); })
            .startAngle(function (d) { return x(d.FluType); })
            .endAngle(function (d) { return x(d.FluType) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Add the labels
    svg_circular.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.FluType) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) { return "rotate(" + ((x(d.FluType) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['Death/Million(AVG)']) + 10) + ",0)"; })
        .append("text")
        .text(function (d) { return (d.FluType) })
        .attr("transform", function (d) { return (x(d.FluType) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle")

});

var mouseover = function (d) {
    console.log(d);

    tooltip_2
        .html("Type: " + d.FluType + " Mortality: " + d.Global_mortality_rate)
        .style("opacity", 1);
    d3
        .select(this).style("stroke", "white")
}
var mousemove = function (d) {
    tooltip_2
        .style("left", d3.mouse(this)[0] + 90 + "px")
        .style("top", d3.mouse(this)[1] + 270 + "px");

}
var mouseleave = function (d) {
    tooltip_2
        .style("opacity", 0)
    d3
        .select(this).style("stroke", "#4863A0");
}