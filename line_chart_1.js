// Define the dimensions and margins
var margin = { top: 10, right: 30, bottom: 30, left: 50 },
    width2 = 890 - margin.left - margin.right,
    height2 = 600 - margin.top - margin.bottom;

if (window.innerWidth <= 800) {
    width2 = 280,
        height2 = 290;
}

// Append the svg object to the <body>
var svg2 = d3.select("#line-graph")
    .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/kinoshita197083/Data_visualisation_project/master/US_COVID_DVP1.csv",

    // Formatting variables during csv loading:
    function (d) {
        return { date: d3.timeParse("%Y-%m-%d")(d.date), new_cases: d.new_cases, icu_patients: d.icu_patients }
    },

    // Using this dataset:
    function (data) {

        // Add X-axis 
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, width2]);
        xAxis = svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x));

        // Add X-axis for the overlapping line graph
        var x_2 = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, width2]);
        xAxis_2 = svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x_2));


        // Add Y-axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.new_cases; })])
            .range([height2, 0]);
        yAxis = svg2.append("g")
            .call(d3.axisLeft(y));


        // Add Y-axis for the overlapping line graph
        var y_2 = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.icu_patients; })])
            .range([height2, 0]);
        yAxis_2 = svg2.append("g")
            .call(d3.axisLeft(y_2)).attr("transform", "translate(" + width2 + ",0)");


        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg2.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width2)
            .attr("height", height2)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                   // Add the brush feature
            .extent([[0, 0], [width2, height2]])  // Initialising the brush area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        var brush_2 = d3.brushX()                   // Add the brush feature, same as the first one, for testing purpose
            .extent([[0, 0], [width2, height2]])  // initialise the brush area
            .on("end", updateChart)


        // Create the line variable: where both the line and the brush take place
        var line = svg2.append('g')
            .attr("clip-path", "url(#clip)")

        // Now the 2nd line
        var line_2 = svg2.append('g')
            .attr("clip-path", "url(#clip)")


        // Add the 1st line
        line.append("path")
            .datum(data)
            .attr("class", "line")  // For later modifying purpose
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.date) })
                .y(function (d) { return y(d.new_cases) })
            )


        //Add the 2nd line
        line_2.append("path")
            .datum(data)
            .attr("class", "line_2")  // For later modifying purpose
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x_2(d.date) })
                .y(function (d) { return y_2(d.icu_patients) })
            )



        // Add the brushing
        line
            .append("g")
            .attr("class", "brush")
            .call(brush);

        line_2
            .append("g")
            .attr("class", "brush_2")
            .call(brush_2);


        // Set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }

        // Update the chart for given boundaries
        function updateChart() {

            // Store the selected boundaries?
            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain([4, 8])
                x_2.domain([4, 8])
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                x_2.domain([x_2.invert(extent[0]), x_2.invert(extent[1])])
                line.select(".brush").call(brush.move, null)
                line_2.select(".brush").call(brush.move, null)
            }

            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            line
                .select('.line')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.new_cases) })
                )

            // Update 2nd axis and 2nd line position
            xAxis_2.transition().duration(1000).call(d3.axisBottom(x_2))
            line_2
                .select('.line_2')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x_2(d.date) })
                    .y(function (d) { return y_2(d.icu_patients) })
                )
        }

        // Double click, reinitialize the chart
        svg2.on("dblclick", function () {
            x.domain(d3.extent(data, function (d) { return d.date; }))
            xAxis.transition().call(d3.axisBottom(x))
            line
                .select('.line')
                .transition()
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.new_cases) })
                )

            x_2.domain(d3.extent(data, function (d) { return d.date; }))
            xAxis_2.transition().call(d3.axisBottom(x_2))
            line_2
                .select('.line_2')
                .transition()
                .attr("d", d3.line()
                    .x(function (d) { return x_2(d.date) })
                    .y(function (d) { return y_2(d.icu_patients) })
                )
        });

    })