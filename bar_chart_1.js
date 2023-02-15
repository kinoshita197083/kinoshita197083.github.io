// Define the dimensions and margins
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 920 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


if (window.innerWidth < 800) {
    width = 270,
        height = 300;
    console.log(window.innerWidth);
}

// Append the svg object to the <body>
var svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialise the X-axis
var x2 = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
var xAxis2 = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

// Initialise the Y-axis
var y2 = d3.scaleLinear()
    .range([height, 10]);
var yAxis2 = svg.append("g")
    .attr("class", "myYaxis")

svg.attr("transform", "translate(65, 50)")

//Construct tooltip
var tooltip = d3.select("#bar-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "120px")
    .style("position", "absolute")

// Create or Update the plot for a given variable:
function update(selectedVar) {

    // Parse the Data
    d3.csv("https://raw.githubusercontent.com/kinoshita197083/Data_visualisation_project/master/Flu_season_data_9years.csv", function (data) {

        // X-axis
        x2.domain(data.map(function (d) { return d.Season; }))
        xAxis2.transition().duration(1000).call(d3.axisBottom(x2));

        // Add Y-axis
        y2.domain([0, d3.max(data, function (d) { return +d[selectedVar] })]);
        yAxis2.transition().duration(1000).call(d3.axisLeft(y2));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        var mouseover = function (d) {
            var value = d[selectedVar];

            tooltip
                .html("Value: " + value)
                .style("opacity", 1);
            d3
                .select(this).style("fill", "black");
        }
        var mousemove = function (d) {

            if (window.innerWidth <= 800) {
                tooltip
                    .style("left", d3.mouse(this)[0] + 30 + "px")
                    .style("top", d3.mouse(this)[1] + 250 + "px");
            } else {
                tooltip
                    .style("left", d3.mouse(this)[0] + 190 + "px")
                    .style("top", d3.mouse(this)[1] + 250 + "px");
            }
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3
                .select(this).style("fill", "#98AFC7");
        }

        // update bars
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function (d) { return x2(d.Season); })
            .attr("y", function (d) { return y2(d[selectedVar]); })
            .attr("width", x2.bandwidth())
            .attr("height", function (d) { return height - y2(d[selectedVar]); })
            .attr("fill", "#98AFC7")

        u
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

}
